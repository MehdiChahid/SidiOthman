<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="index, follow">
        <meta name="googlebot" content="index, follow">
        <meta name="bingbot" content="index, follow">

        <title inertia>{{ config('app.name', 'Cardtofaiza') }}</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="Pr. ALAOUI Faiza - Professeure de droit privé, Coordinatrice du Master DAEB à l'Université Abdelmalek Essaâdi de Tanger. Arbitre agréée, experte en droit des affaires et e-business.">
        <meta name="keywords" content="Pr. ALAOUI Faiza, professeure droit privé, Master DAEB, Université Abdelmalek Essaâdi, Tanger, arbitre, droit des affaires, e-business, FSJES, faculté droit Tanger">
        <meta name="author" content="Pr. ALAOUI Faiza">
        <meta name="language" content="fr">
        <meta name="geo.region" content="MA-TNG">
        <meta name="geo.placename" content="Tanger, Maroc">
        <meta name="geo.position" content="35.7595;-5.8340">
        <meta name="ICBM" content="35.7595, -5.8340">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="Pr. ALAOUI Faiza - Professeure de droit privé | Master DAEB Tanger">
        <meta property="og:description" content="Professeure de droit privé, Coordinatrice du Master DAEB à l'Université Abdelmalek Essaâdi de Tanger. Arbitre agréée, experte en droit des affaires et e-business.">
        <meta property="og:image" content="{{ asset('images/faiza.png') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:site_name" content="Pr. ALAOUI Faiza - Portfolio">
        <meta property="og:locale" content="fr_FR">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="Pr. ALAOUI Faiza - Professeure de droit privé | Master DAEB Tanger">
        <meta property="twitter:description" content="Professeure de droit privé, Coordinatrice du Master DAEB à l'Université Abdelmalek Essaâdi de Tanger. Arbitre agréée, experte en droit des affaires et e-business.">
        <meta property="twitter:image" content="{{ asset('images/faiza.png') }}">

        <!-- Canonical URL -->
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Favicon -->
        <link rel="icon" href="{{ asset('icon.png') }}" type="image/x-icon">
        <link rel="apple-touch-icon" href="{{ asset('icon.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Structured Data -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Pr. ALAOUI Faiza",
            "jobTitle": "Professeure de droit privé",
            "worksFor": {
                "@type": "Organization",
                "name": "Université Abdelmalek Essaâdi",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Tanger",
                    "addressCountry": "MA"
                }
            },
            "alumniOf": "Université Abdelmalek Essaâdi",
            "knowsAbout": ["Droit privé", "Droit des affaires", "E-business", "Arbitrage"],
            "url": "{{ url()->current() }}",
            "image": "{{ asset('images/faiza.png') }}",
            "description": "Professeure de droit privé, Coordinatrice du Master DAEB à l'Université Abdelmalek Essaâdi de Tanger. Arbitre agréée, experte en droit des affaires et e-business."
        }
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
