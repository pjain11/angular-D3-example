module.exports = function() {
    var baseClient = './src/client/',
        temp = './.tmp/',
        clientApp = baseClient + 'app/',
        dist = './dist/';

    var config = {
        clientApp: clientApp,
        sass: baseClient + 'styles/main.scss',
        styles: baseClient + 'styles/**/*.scss',
        temp: temp,
        dist: dist,
        bowerFilePath: './bower.json',
        htmlTemplates: [clientApp + '**/*.html', '!' + clientApp + '**/*.js.html',
            '!' + clientApp + '**/index.html', '!' + clientApp + 'layout/*.html'],
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'ngD3Example.widgets',
                root: 'app/',
                standAlone: false
            }
        },
        commonFileName: 'ngD3Example-common',
        bowerRepoDir: 'bower-ngD3Example',
        bowerRepo: 'https://github.com/pjain11/bower-ngD3Example'
    };

    return config;
}