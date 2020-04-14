toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};
$(document).ready(function() {
  $("#preloader").fadeOut();
});
function getPope(str) {
  let newVal = str.match(/{{\s*[\w\.]+\s*}}/g);
  if (typeof newVal === "undefined" || newVal == null) return Array();
  return newVal.map(function(x) {
    return x.match(/[\w\.]+/)[0];
  });
}
// Ajax File upload with jQuery and XHR2
// Sean Clark http://square-bracket.com
// xhr2 file upload
$.fn.upload = function(remote, data, successFn, progressFn) {
  // if we dont have post data, move it along
  if (typeof data != "object") {
    progressFn = successFn;
    successFn = data;
  }

  var formData = new FormData();

  var numFiles = 0;
  this.each(function() {
    var i,
      length = this.files.length;
    numFiles += length;
    for (i = 0; i < length; i++) {
      formData.append(this.name, this.files[i]);
    }
  });

  // if we have post data too
  if (typeof data == "object") {
    for (var i in data) {
      formData.append(i, data[i]);
    }
  }

  var def = new $.Deferred();
  if (numFiles > 0) {
    // do the ajax request
    $.ajax({
      url: remote,
      type: "POST",
      xhr: function() {
        myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload && progressFn) {
          myXhr.upload.addEventListener(
            "progress",
            function(prog) {
              var value = ~~((prog.loaded / prog.total) * 100);

              // if we passed a progress function
              if (typeof progressFn === "function") {
                progressFn(prog, value);

                // if we passed a progress element
              } else if (progressFn) {
                $(progressFn).val(value);
              }
            },
            false
          );
        }
        return myXhr;
      },
      data: formData,
      dataType: "json",
      cache: false,
      contentType: false,
      processData: false,
      complete: function(res) {
        var json;
        try {
          json = JSON.parse(res.responseText);
        } catch (e) {
          json = res.responseText;
        }
        if (typeof successFn === "function") successFn(json);
        def.resolve(json);
      }
    });
  } else {
    def.reject();
  }

  return def.promise();
};
class JsonHelper {
  constructor() {
    this._result = Array();
  }
  prettifyCamelCase(str) {
    var output = "";
    var len = str.length;
    var char;

    for (var i = 0; i < len; i++) {
      char = str.charAt(i);
      if (i == 0) {
        output += char.toUpperCase();
        continue;
      }

      if (output.length == 0) {
        output += char.toUpperCase();
      } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
        output += " " + char;
      } else if (char == "-" || char == "_" || char == ".") {
        output += " ";
      } else {
        output += char;
      }
    }

    // return output;
    return output.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  camelCaseToWords(str) {
    if (!isNaN(str)) return str;
    return str
      .match(/^[a-z]+|[A-Z][a-z]*/g)
      .map(function(x) {
        return x[0].toUpperCase() + x.substr(1).toLowerCase();
      })
      .join(" ");
  }
  toArr(obj, p = "") {
    const result = [];
    for (const prop in obj) {
      const value = obj[prop];
      // let propD = "['"+prop+"']";
      let propD = prop;
      if (!isNaN(prop)) {
        // is number
        propD = "[" + parseInt(prop) + "]";
      } else {
        propD = "." + prop;
      }

      let tmp = p == "" ? propD : p + propD;
      if (typeof value === "object") {
        result.push(this.toArr(value, tmp)); // <- recursive call
      } else {
        result.push({
          value,
          prop: tmp,
          key: prop
          // name: this.prettifyCamelCase(prop)
        });
      }
    }
    return result;
  }
  extractElements(obj) {
    obj.forEach(e => {
      if (Array.isArray(e)) {
        this._result = this.extractElements(e);
      } else {
        this._result.push(e);
      }
    });
    return this._result;
  }
  toArray(d) {
    this._result = Array();
    let arrayTmp = this.extractElements(this.toArr(d));
    arrayTmp.forEach(e => {
      e.context = e.prop.replace(".", "");
      e.name = this.prettifyCamelCase(e.prop).replace(".", "");
    });
    return arrayTmp;
  }
  byString(o, s) {
    // obj , selecter
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    var a = s.split(".");
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }
}
