// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    api_url: 'http://localhost:8080',
    client_id: '1_36r5u9uleb8kc8kcwoksow4o4wswwcw8wsw4so0ockosowkowc',
    client_secret: '4s702vda5o6c8c8kg08kckcko4g8k0kwswcs8k80gocs8ggw0w',
    stripe_publishable_key: 'pk_test_DSdJuENZUUWTXy4ml3R54NbF',
    google_recaptcha_key: '6LcOz2MUAAAAANOpWHgQXetTBehG8BPrRz2zVAi8',
    extensions: [
        'doc',
        'dot',
        'docx',
        'docm',
        'dotx',
        'dotm',
        'xls',
        'xlt',
        'xlsx',
        'xlsm',
        'xltx',
        'xltm',
        'ppt',
        'pot',
        'pptx',
        'pptm',
        'potx',
        'potm',
        'odt',
        'ods',
        'odp',
        'vsd',
        'pdf',
        'gif',
        'jp2',
        'jpf',
        'j2k',
        'jpm',
        'jpx',
        'jpeg',
        'jpg',
        'jpe',
        'm4a',
        'm4b',
        'm4p',
        'm4v',
        'mov',
        'qt',
        'mp4',
        'png',
        'jng',
        'mng',
        'psd',
        'psb',
        'tiff',
        'tif'
    ],
    unregisterPlan: {
        'name': 'Unregistered Users',
        'size': '5 MB File size limit',
        'traffic': '1 files / day traffic limit',
        'access': 'Access only via Web',
    },
    registerPlan: {
        'name': 'Registered Users',
        'size': '5 MB File size limit',
        'traffic': '5 files / day traffic limit',
        'access': 'Access only via Web',
    },
    basicPlan: {
        'price': '5',
        'name': 'Basic',
        'size': '30 MB File size limit',
        'traffic': '1 GB / month traffic limit',
        'access': 'Access only via Web',
        'feature': 'View & Edit Metadata, Bulk Cleaning of Files',
        'lookupKey': 'plan_DDneMjlSwJYFNt',
        'paypalKey': 'P-63K740948U476115JMIG5N6I'
    },
    advancePlan: {
        'price': '30',
        'name': 'Advance',
        'size': '50 MB File size limit',
        'traffic': '10 GB / month traffic limit',
        'access': 'Web / 3 API apps',
        'feature': 'View & Edit Metadata, Bulk Cleaning of Files',
        'lookupKey': 'P-63071347Y2184683NMIK55XI',
        'paypalKey': 'P-63071347Y2184683NMIK55XI',
    },
    enterprisePlan: {
        'price': '50',
        'name': 'Enterprise',
        'size': '50 MB File size limit',
        'traffic': '100 GB / month traffic limit',
        'access': 'Web / Unlimited API apps',
        'feature': 'View & Edit Metadata, Bulk Cleaning of Files',
        'lookupKey': 'P-8XE53173PN778351BMIK56NI',
        'paypalKey': 'P-8XE53173PN778351BMIK56NI',
    },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
