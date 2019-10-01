const config = {
  js: {
    paths: [
      "./../rgi/js/interface.js",
      "./../rgi/js/uploader.js",
      "./../rgi/js/form-manager.js",
      "./../rgi/js/site.js"
    ],
    dist: "./dist/js",
    include: "./dist/js/include.tpl",
    pattern: `<script src="/{$tag.common_envir.before_url}js/{{file}}"></script>`
  },
  css: {
    paths: [
      "./../rgi/css/bootstrap.css",
      "./../rgi/css/bootstrap-theme.css",
      "./../rgi/css/bootstrap-multiselect.css",
      "./../rgi/css/jQuery.Tree.css",
      "./../rgi/css/jquery-ui.css",
      "./../rgi/css/bootstrap-datetimepicker.min.css",
      "./../rgi/css/stylesheet.css",
      "./../rgi/css/style_new.css",
      "./../rgi/css/grid.css",
      "./../rgi/plugins/FileViewer/css/fileviewer.css",
      "./../rgi/plugins/chosen-js/chosen.min.css",
      "./../rgi/css/jquery_notification.css"
    ],
    dist: "./dist/css",
    include: "./dist/css/include.tpl",
    pattern: `<link href="/{$tag.common_envir.before_url}css/{{file}}" rel="stylesheet">`
  }
};

exports.js = config.js;
exports.css = config.css;
