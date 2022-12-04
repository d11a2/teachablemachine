module.exports = {
    SRC_PATH: "src",
    DIST_PATH: "dist",
    STYLES_LIBS: ["node_modules/normalize.css/normalize.css"],
    JS_LIBS: ["node_modules/jquery/dist/jquery.min.js"],
    PLUGINS: [
        "gulp-rm",
        "sass",
        "gulp-sass",
        "browser-sync",
        "gulp-concat",
        "gulp-sass-glob",    // easy imports
        "gulp-autoprefixer",
        "gulp-group-css-media-queries",
        "gulp-clean-css",
        "gulp-sourcemaps",
        "gulp-uglify",
        "gulp-if",
        "cross-env"
    ],
    PACKAGE_JSON: [
        {
            "scripts": {
                "gulp": "cross-env NODE_ENV=dev gulp",
                "build": "cross-env NODE_ENV=prod gulp build",
            },
            "name": "test",
            "main": "gulpfile.js",
            "author": "omnenet@gmail.com",
        },
    ]
}
