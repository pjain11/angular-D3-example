module.exports = function() {
    var baseClient = './src/client/',
        temp = './.tmp/';

    var config = {
        sass: baseClient + 'styles/main.scss',
        styles: baseClient + 'styles/**/*.scss',
        temp: temp
    };

    return config;
}