function formatState(state) {
  if (state.children) {
    var $state = $(`<span><i class="fa fa-sitemap"></i>${state.text}</span>`);
    return $state;
  }
  let name = isNaN(state.text) ? state.text : state.id;
  let title = state.title || "";
  var $state = $(
    `<span><span style="font-weight: 800; padding-right: 10px; color:#606e73">${name}</span> <span style="font-weight: 100; color:#aeb7bc;">${title}</span></span>`
  );
  return $state;
}

function readySelectBox(_id, arr, _name) {
  let dataOpts = [
    {
      id: 0,
      text: _name,
      children: []
    }
  ];
  arr.forEach(e => {
    dataOpts[0].children.push({
      id: e.context,
      title: e.value,
      text: e.name
    });
  });
  $(_id).select2({
    data: dataOpts,
    templateResult: formatState,
    placeholder: "Select an index",
    width: "100%"
  });
  $(_id).on("select2:open", function() {
    $(".select2-search__field").attr("placeholder", "Search...");
  });
}

// $(function() {
//   $(".makeSelectBox").click(function() {
//     // console.log("click");
//     // $('.select2_selecter_custom').remove();
//     let tmpId = $(this).data("for");
//     let box = `<span class="select2_selecter_custom"><select id="selectBoxID" class="select2_selecter_custom__selectbox"><option></option></select></span>`;
//     $("#" + tmpId).after(box);
//     readySelectBox("#selectBoxID", mappingArr, "New Action Mapping");
//     $("#selectBoxID").select2("open");
//     $(".select2_selecter_custom__selectbox").on("select2:close", function() {
//       setTimeout(() => {
//         $(".select2_selecter_custom").remove();
//       }, 500);
//     });
//     $(".select2_selecter_custom__selectbox").on("select2:select", function(e) {
//       console.log(tmpId);
//       console.log(e.params);
//       $("#" + tmpId).val($("#" + tmpId).val() + "{{" + e.params.data.id + "}}");
//       $("#" + tmpId).focus();
//     });
//   });
// });
