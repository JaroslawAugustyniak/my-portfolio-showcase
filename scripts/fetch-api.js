import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !process.env[key.trim()]) {
    process.env[key.trim()] = value.trim();
  }
});

const API_URL = process.env.VITE_WORDPRESS_API_URL;
const OUTPUT_DIR = path.join(__dirname, '../public/api');

if (!API_URL) {
  console.error('❌ VITE_WORDPRESS_API_URL not set');
  process.exit(1);
}

// Stwórz foldery jeśli nie istnieją
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const headers = {
  'Content-Type': 'application/json',
};

async function fetchFromAPI(endpoint, params = {}) {
  try {
    const url = new URL(`${API_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
    return null;
  }
}

async function getSiteSettings(postId = null) {
  try {
    const baseUrl = API_URL.replace('/wp/v2', '');
    const url = new URL(`${baseUrl}/moje-api/v1/info`);

    if (postId) {
      url.searchParams.append('id', String(postId));
    }

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching site settings:`, error.message);
    return {};
  }
}


async function fetchAndSave(endpoint, filename, params = {}, isPostData = false) {
  console.log(`📡 Fetching ${filename}...`);

  let data = await fetchFromAPI(endpoint, params);
  if (!data) return;

  // Jeśli to dane postów/pages, dodaj siteSettings i pobierz obrazki
  if (isPostData && Array.isArray(data)) {
    // Filtruj po języku jeśli `lang` parametr jest podany
    if (params.lang) {
      data = data.filter(item => {
        // Sprawdź czy item ma wybrany język jako domyślny lub w translations
        if (item.lang === params.lang) return true;
        // Jeśli item ma translations, sprawdź czy ma tłumaczenie na dany język
        if (item.translations && item.translations[params.lang]) return true;
        // Fallback - zwróć item jeśli nie ma informacji o języku
        return !item.lang && !item.translations;
      });
    }

    console.log(`   Processing ${data.length} items...`);

    const globalSettings = await getSiteSettings();

    const enrichedData = await Promise.all(
      data.map(async (item) => {
        // Pobierz siteSettings dla tego konkretnego wpisu
        const itemSettings = await getSiteSettings(item.id);

        return {
          ...item,
          siteSettings: itemSettings || globalSettings,
        };
      })
    );

    const output = {
      siteSettings: globalSettings,
      data: enrichedData,
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, filename),
      JSON.stringify(output, null, 2)
    );
  } else {
    // Dla zwykłych danych (languages, menu) - zapisz tak jak jest
    fs.writeFileSync(
      path.join(OUTPUT_DIR, filename),
      JSON.stringify(data, null, 2)
    );
  }

  console.log(`✅ Saved ${filename}`);
}

async function main() {
  console.log('🚀 Fetching API data and generating static JSON files...\n');

  try {
    const baseUrl = API_URL.replace('/wp/v2', '');

    // Pobierz listę języków
    const langUrl = new URL(`${baseUrl}/pll/v1/languages`);
    const langResponse = await fetch(langUrl.toString(), { headers });
    if (!langResponse.ok) {
      throw new Error('Failed to fetch languages');
    }
    const langData = await langResponse.json();
    const languages = Array.isArray(langData) ? langData : langData.languages || [];
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'languages.json'),
      JSON.stringify(languages, null, 2)
    );
    console.log('✅ Saved languages.json');

    // Dla każdego języka - pobierz dane
    for (const lang of languages) {
      const langSlug = lang.slug;
      const langDir = path.join(OUTPUT_DIR, langSlug);

      // Stwórz folder dla języka
      if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
      }

      console.log(`\n📍 Processing language: ${langSlug}`);

      // Pobierz sekcje (custom post type)
      console.log(`   Fetching sections for ${langSlug}...`);
      const allSections = await fetchFromAPI('/section', {
        per_page: 100,
        _embed: 'wp:term,wp:featuredmedia',
        acf: true,
      });

      if (allSections && allSections.length > 0) {
        // Filtruj sekcje - weź tylko te dla wybranego języka
        const sectionsForLang = allSections.filter(section => {
          if (section.translations && section.translations[langSlug]) {
            return section.id === section.translations[langSlug].id;
          }
          return !section.translations;
        });

        // Pobierz pełne dane dla tych sekcji
        const sectionIds = sectionsForLang.map(s => s.id);
        if (sectionIds.length > 0) {
          await fetchAndSave('/section', `${langSlug}/sections.json`, {
            include: sectionIds.join(','),
            per_page: 100,
            _embed: 'wp:term,wp:featuredmedia',
            acf: true,
            lang: langSlug,
          }, true);
        }
      }

      // Pobierz projekty z kategorii "recommended"
      console.log(`   Fetching recommended category for ${langSlug}...`);
      const recommendedCategories = await fetchFromAPI('/categories', {
        slug: 'recommended',
        lang: langSlug
      });
      console.log(`   Found ${recommendedCategories?.length || 0} categories`);

      if (recommendedCategories && recommendedCategories.length > 0) {
        const categoryId = recommendedCategories[0].id;
        await fetchAndSave('/posts', `${langSlug}/projects.json`, {
          categories: categoryId,
          per_page: 100,
          _embed: 'wp:term,wp:featuredmedia',
          acf: true,
          lang: langSlug,
        }, true);
      } else {
        console.warn(`⚠️  Recommended category not found for ${langSlug}`);
        // Fallback - pobierz wszystkie posty dla tego języka bez kategorii
        console.log(`   Fetching all posts for ${langSlug} without category filter...`);
        await fetchAndSave('/posts', `${langSlug}/projects.json`, {
          per_page: 100,
          _embed: 'wp:term,wp:featuredmedia',
          acf: true,
          lang: langSlug,
        }, true);
      }

      // Pobierz strony
      // Najpierw pobierz wszystkie pages aby znaleźć IDs dla konkretnego języka
      const allPages = await fetchFromAPI('/pages', {
        per_page: 100,
        _embed: 'wp:term,wp:featuredmedia',
        acf: true,
      });

      if (allPages && allPages.length > 0) {
        // Filtruj strony - weź tylko te dla wybranego języka
        const pagesForLang = allPages.filter(page => {
          // Jeśli page ma translations dla wybranego języka - weź ID z translations
          if (page.translations && page.translations[langSlug]) {
            return page.id === page.translations[langSlug].id;
          }
          // Jeśli brak translations - zwróć page (może być language-agnostic)
          return !page.translations;
        });

        // Teraz pobierz pełne dane dla tych pages
        const pageIds = pagesForLang.map(p => p.id);
        if (pageIds.length > 0) {
          const pagesData = await fetchFromAPI('/pages', {
            include: pageIds.join(','),
            per_page: 100,
            _embed: 'wp:term,wp:featuredmedia',
            acf: true,
            lang: langSlug,
          });

          // Zapisz do pliku
          if (pagesData && pagesData.length > 0) {
            await fetchAndSave('/pages', `${langSlug}/pages.json`, {
              include: pageIds.join(','),
              per_page: 100,
              _embed: 'wp:term,wp:featuredmedia',
              acf: true,
              lang: langSlug,
            }, true);
          }
        }
      }

      // Pobierz siteSettings dla tego języka
      const langSettings = await getSiteSettings();
      fs.writeFileSync(
        path.join(langDir, 'siteSettings.json'),
        JSON.stringify(langSettings, null, 2)
      );
      console.log(`✅ Saved ${langSlug}/siteSettings.json`);
    }

    // Pobierz menu (dla każdego języka)
    console.log('\n📡 Fetching menu for all languages...');
    for (const lang of languages) {
      const langSlug = lang.slug;
      const menuUrl = new URL(`${baseUrl}/moje-api/v1/menu/menu`);
      if (langSlug) {
        menuUrl.searchParams.append('lang', langSlug);
      }

      const menuResponse = await fetch(menuUrl.toString(), { headers });
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        const langDir = path.join(OUTPUT_DIR, langSlug);
        if (!fs.existsSync(langDir)) {
          fs.mkdirSync(langDir, { recursive: true });
        }
        fs.writeFileSync(
          path.join(langDir, 'menu.json'),
          JSON.stringify(menuData, null, 2)
        );
        console.log(`✅ Saved ${langSlug}/menu.json`);
      } else {
        console.warn(`⚠️  Menu endpoint for ${langSlug} failed: ${menuResponse.status}`);
      }
    }

    // Pobierz globalne ustawienia
    const globalSettings = await getSiteSettings();
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'siteSettings.json'),
      JSON.stringify(globalSettings, null, 2)
    );
    console.log('✅ Saved siteSettings.json');

    console.log('\n✨ All data fetched and saved successfully!');
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('Error details:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
