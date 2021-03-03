const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const watch = require("gulp-watch");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const gulpif = require("gulp-if");
const less = require("gulp-less");
const pump = require("pump");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const sitemap = require("gulp-sitemap");

const templateData = require("./src/data/context.json");

gulp.task("build-html", function () {
  const options = {
    // partials (reusable files - are referenced like {{> header}})
    batch: ["./src/templates/", "./src/templates/icons/"],
  };

  return gulp
    .src("src/*.html")
    .pipe(handlebars(templateData, options))
    .pipe(gulp.dest("dist"))
    .pipe(
      sitemap({
        siteUrl: process.env.URL || "http://quodera.com",
      })
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("build-js", function (cb) {
  const srcFiles = [
    "src/js/libs/jquery-3.2.1.js",
    "src/js/libs/*.js",
    "src/js/scripts.js",
  ];
  pump(
    [
      gulp.src(srcFiles),
      concat("bundle.js"),
      gulpif(process.env.NODE_ENV === "production", uglify()),
      gulp.dest("dist"),
    ],
    cb
  );
});

gulp.task("compile-less", function (cb) {
  pump(
    [
      gulp.src("src/css/styles.less"),
      less(),
      autoprefixer(),
      gulp.dest("src/css"),
    ],
    cb
  );
});

gulp.task(
  "build-css",
  gulp.series("compile-less", function (cb) {
    const srcFiles = [
      "src/css/libs/bootstrap.min.css",
      "src/css/libs/*.css",
      "src/css/styles.css",
    ];
    pump(
      [
        gulp.src(srcFiles),
        concat("bundle.css"),
        gulpif(process.env.NODE_ENV === "production", cleanCSS()),
        gulp.dest("dist"),
      ],
      cb
    );
  })
);

gulp.task(
  "build-assets",
  gulp.parallel(copyAssets, copyFonts, copyFavicon, copyIcons)
);

function copyAssets(cb) {
  pump([gulp.src("src/assets/**/*"), gulp.dest("dist/assets/")], cb);
}

function copyFonts(cb) {
  pump([gulp.src("src/fonts/**/*"), gulp.dest("dist/fonts/")], cb);
}

function copyFavicon(cb) {
  pump([gulp.src("src/assets/img/favicon.ico"), gulp.dest("dist/")], cb);
}

function copyIcons(cb) {
  pump(
    [
      gulp.src("src/icons/**/*.svg"),
      rename({
        prefix: "icon-",
        extname: ".hbs",
      }),
      gulp.dest("src/templates/icons/"),
    ],
    cb
  );
}

gulp.task("watch", gulp.parallel(watchHtml, watchJs, watchCss, watchAssets));

function watchHtml() {
  return gulp.watch(
    ["src/*.html", "src/templates/**/*.hbs"],
    { ignoreInitial: false },
    function () {
      const options = {
        // partials (reusable files - are referenced like {{> header}})
        batch: ["./src/templates/", "./src/templates/icons/"],
      };

      return gulp
        .src("src/*.html")
        .pipe(handlebars(templateData, options))
        .pipe(gulp.dest("dist"))
        .pipe(
          sitemap({
            siteUrl: process.env.URL || "http://quodera.com",
          })
        )
        .pipe(gulp.dest("./dist"));
    }
  );
}

function watchJs() {
  return gulp.watch("src/js/*.js", { ignoreInitial: false }, function (cb) {
    const srcFiles = [
      "src/js/libs/jquery-3.2.1.js",
      "src/js/libs/*.js",
      "src/js/scripts.js",
    ];
    pump(
      [
        gulp.src(srcFiles),
        concat("bundle.js"),
        gulpif(process.env.NODE_ENV === "production", uglify()),
        gulp.dest("dist"),
      ],
      cb
    );
  });
}

function watchCss() {
  return gulp.watch(
    ["src/css/libs/*.css", "src/css/*.less"],
    { ignoreInitial: false },
    gulp.series("compile-less", function (cb) {
      const srcFiles = [
        "src/css/libs/bootstrap.min.css",
        "src/css/libs/*.css",
        "src/css/styles.css",
      ];
      pump(
        [
          gulp.src(srcFiles),
          concat("bundle.css"),
          gulpif(process.env.NODE_ENV === "production", cleanCSS()),
          gulp.dest("dist"),
        ],
        cb
      );
    })
  );
}

function watchAssets() {
  return gulp.watch(
    ["src/assets/**/*", "src/icons/**/*"],
    { ignoreInitial: false },
    gulp.parallel(copyAssets, copyFonts, copyFavicon, copyIcons)
  );
}

gulp.task(
  "build",
  gulp.parallel("build-html", "build-js", "build-css", "build-assets")
);
