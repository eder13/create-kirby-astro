# create-astro-kirby

An Astro + Kirby template that builds static assets with Astro and injects them into your Kirby site.

### Requirements:

- NPM/NodeJS
- Composer/PHP

### TODOs

if multiple languages are supplied, the first language specified is the default language

gitignore and README create in the root of the folder - create also .env file automatically

the following files need adjustments in order to function properly:

- create htaccess parts additional things for redirection
- if languages specified -> astro folder need to be created with e.g. de, en inside frontend/src/pages + meta file for default language
- additionally, the files in the folder cms/site/languages need to be generated with the language, as well as set the default language as well - generated, just ajust {{locale}} and {{default}}
- 'languages' => true, in config.php
- all astro files -> extend with language, per default they just fetch /cms, but with the change they should fetch /cms/de
- messages endpoint wird nur angelegt wenn multiple languages verwendet werden in config.php
- Layout.astro anpassung
  -- bei single - anpassen das currentlanguage kopiert wird
- bei multiple logik mit traslation Helfer
- ganzen content pages in cms - eben language abhängig machen und erstellen - da auch die sprache ändern
- language selector in navbar wenn multiple languages hinzufügen
- components that need updated
    - Navbar.astro (TranslationHelper current language link logo AND Language Switcher Dropdown)
    - -> there are a punch of files that in general need to be added
      best start fresh and check the diffs between the normal files that are already added and then add them in multiple language setup

### multi setup

### BE

- site/config.php
    - set languages true, add getObjectTranslations to route
    - sitemaps language specific
    - robots.txt disallow error paths
- site/helpers/translation_keys
    - create that file and return data - include as needed and specified by CLI languages
- template/cms/site/languages - create that folder languages and move all the languages i.e. de.php, en.php, etc. from multiple-lang
- programmatically create template/cms/site/templates/error.php

### FE

- all components where const t = await TranslationHelper.getInstance(); was used
- TranslationHelper.ts
- types/language
- langueas in pages folder -> delete e.g. /fr if not specified

### Template

files that need replacements in template data - loop over every file in general and check if these are present
-> replace.

```txt
--htaccess-- (special - need to alter the file indepentently isnce it is file moving included)
forEach(langs) -> create entry of .htaccess-template-language-mod_rewrite
{{lang}} => de, en, ---
{{langs}} => /de/?|/en/?|/es/? ...

defaultEntry -> create entry of .htaccess-template-language-fallback-mod_rewrite
{{langs}} => /de/?|/en/?|/es/? ...
{{defaultLang}} => de, en, ...

--languages/lang-template.php: ---
forEach(langs) - create <lang>.php
{{default}} => true|false
{{locale}} => de_DE ...
{{lang}} => de ...
{{code}} => de, en ...


--config.php -- ✅
{{disallowErrorLanguagePages}} => Disallow: /de/error\nDisallow: /en/error\n ...

--sitemap-index.php -- ✅
{{sitemapLanguages}} =>
$latestLang = array(
    "de" => 0,
    "en" => 0,
    ...
);
{{lastModifiedLanguageChecks}} =>
if (preg_match('#^.*\/de(\/|\/.*)?#', $p->url())) {
    $modified = (int)strtotime($p->modified('c'));
    if ($modified > $latestLang["de"]) {
        $latestLang["de"] = $modified;
    }
}
if (preg_match('#^.*\/en(\/|\/.*)?#', $p->url())) {
    $modified = (int)strtotime($p->modified('c'));
    if ($modified > $latestLang["en"]) {
        $latestLang["en"] = $modified;
    }
}
...

-- Navbar.astro --
{{languageSelectorOptions}} =>
{
    id: "en",
    title: { value: "English" },
    url: "/en",
},
{
    id: "de",
    title: { value: "German" },
    url: "/de",
},
...

-- TranslationHelper.ts --
{{availableLanguagesTranslations}}
=>
[Language.DE]: LanguageEntry;
[Language.EN]: LanguageEntry;
...
{{getCurrentAstroLanguageChecks}}
=>
if (pathname.startsWith(`/${Language.DE}`)) {
    return Language.DE;
}
if (pathname.startsWith(`/${Language.EN}`)) {
    return Language.EN;
}
...


error.astro ✅
{{lang}}

Layout.astro ✅
{{lang}}

```

usage

node bin/index.js --name=myProjectName

- builds with default, i.e. language is en and en-US

```
npx create-kirby-astro --name=myProjectName
```

- builds with specified lang

```
npx create-kirby-astro --name=myProjectName --langs=[de]
```

- builds with specified lang + locales

```
npx create-kirby-astro --name=myProjectName --langs=[de] --locales=[de-DE]
```

- multiple language setups

```
npx create-kirby-astro --name=myProjectName --langs=[de, en] --locales=[de-DE, en-US]
```
