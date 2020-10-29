var db = new Dexie("RandPick");
db.version(5).stores({
projects: "++id,name,count"
});
db.version(4).stores({
data: "++id,project_id,alias,value,date"
});
db.open();

$(document).ready(function() {
  
        filer_default_opts = {
            changeInput2: '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag&Drop files here</h3> <span style="display:inline-block; margin: 15px 0">or</span></div><a class="jFiler-input-choose-btn btn-custom blue-light">Browse Files</a></div></div>',
            templates: {
                box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
                item: '<li class="jFiler-item" style="width:49%">\
                            <div class="jFiler-item-container">\
                                <div class="jFiler-item-inner">\
                                    <div class="jFiler-item-thumb">\
                                        <div class="jFiler-item-status"></div>\
                                        <div class="jFiler-item-thumb-overlay">\
    										<div class="jFiler-item-info">\
    											<div style="display:table-cell;vertical-align: middle;">\
    												<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
    												<span class="jFiler-item-others">{{fi-size2}}</span>\
    											</div>\
    										</div>\
    									</div>\
                                        {{fi-image}}\
                                    </div>\
                                    <div class="jFiler-item-assets jFiler-row">\
                                        <ul class="list-inline pull-left">\
                                            <li>{{fi-progressBar}}</li>\
                                        </ul>\
                                        <ul class="list-inline pull-right">\
                                            <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                                        </ul>\
                                    </div>\
                                </div>\
                            </div>\
                        </li>',
                itemAppend: '<li class="jFiler-item" style="width:49%">\
                                <div class="jFiler-item-container">\
                                    <div class="jFiler-item-inner">\
                                        <div class="jFiler-item-thumb">\
                                            <div class="jFiler-item-status"></div>\
                                            <div class="jFiler-item-thumb-overlay">\
        										<div class="jFiler-item-info">\
        											<div style="display:table-cell;vertical-align: middle;">\
        												<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
        												<span class="jFiler-item-others">{{fi-size2}}</span>\
        											</div>\
        										</div>\
        									</div>\
                                            {{fi-image}}\
                                        </div>\
                                        <div class="jFiler-item-assets jFiler-row">\
                                            <ul class="list-inline pull-left">\
                                                <li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
                                            </ul>\
                                            <ul class="list-inline pull-right">\
                                                <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                                            </ul>\
                                        </div>\
                                    </div>\
                                </div>\
                            </li>',
                progressBar: '<div class="bar"></div>',
                itemAppendToEnd: false,
                removeConfirmation: true,
                _selectors: {
                    list: '.jFiler-items-list',
                    item: '.jFiler-item',
                    progressBar: '.bar',
                    remove: '.jFiler-item-trash-action'
                }
            },
            dragDrop: {}
        };



         $('#filer_input').filer({
        changeInput: '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-folder"></i></div><div class="jFiler-input-text"><h3>Click on this box</h3> <span style="display:inline-block; margin: 15px 0">or</span></div><a class="jFiler-input-choose-btn btn-custom blue-light">Browse Files</a></div></div>',
        showThumbs: true,
        limit:1,
        extensions: ["csv"],
        theme: "dragdropbox",
        templates: filer_default_opts.templates
    });
});


function populateSomeData() {
  console.log("Populating some data", "heading");
  return db.transaction("rw", db.projects, function () {
      db.projects.clear();
      db.projects.add({ name: "David"});
      db.projects.add({ name: "David 1"});
      db.projects.add({ name: "David 2"});
      db.projects.add({ name: "David 3"});
      // Log data from DB:
      }).catch(function (e) {
        console.log(e, "error");
        });
}


function getProjects(){
  io = 0;
  $('#project_list').html('');
  db.projects.orderBy('id').desc().each(function (project) {
      active = '';
      if (io == 0) {
      active = 'active';
      }
      $('#project_list').append(''+
          '  <a href="#project_'+ project.id +'" data-id="'+ project.id +'" data-page=0 class="nav-link '+ active +'" onclick="nav_click(this)"> '+
          '   <span>'+ project.name +'</span> '+
          '    <span>'+ project.count +'</span> '+
          '  </a> '+
          '');

      io++;
      });

}

function refreshProjects(project_id){
  $('#project_list').html('');

  db.projects.orderBy('id').desc().each(function (project) {
      active = '';
      if (parseInt(project_id) == project.id) {
      active = 'active';
      }
      $('#project_list').append(''+
          '  <a href="#project_'+ project.id +'" data-id="'+ project.id +'"  data-page=0 class="nav-link '+ active +'" onclick="nav_click(this)"> '+
          '   <span>'+ project.name +'</span> '+
          '    <span>'+ project.count +'</span> '+
          '  </a> '+
          '');

      });

}


function getData(){
  //do something special
  $('#data_list').html('');
  $('#load_more').hide();        
  project_id = parseInt($('a.nav-link.active').attr('data-id'));
  db.data.where('project_id').equals(project_id).count(function (data) {
      if (data > 10) {
      $('#load_more').show();        
      }
      });
  db.data.where('project_id').equals(project_id).limit(10).reverse().each(function (data) {

      $('#data_list').append('' +
          '              <div class="file-item" data-id='+ data.id +'>'+
          '                <div class="row no-gutters wd-100p">'+
          '                  <div class="col-9 col-sm-5 d-flex align-items-center">'+
          data.alias +
          '                  </div><!-- col-6 -->'+
          '                  <div class="col-3 col-sm-2 tx-right tx-sm-left">'+ data.value +'</div>'+
          '                  <div class="col-6 col-sm-4 mg-t-5 mg-sm-t-0" title="'+ data.date +'">'+ jQuery.timeago(data.date) +'</div>'+
          '                  <div class="col-6 col-sm-1 tx-right mg-t-5 mg-sm-t-0"> '+
          '<div class="dropdown">'+
          '<a href="javascript:void(0)" class="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-more"></i></a>'+
          '  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'+
          '    <a class="dropdown-item" href="javascript:void(0)" data-id='+ data.id +' onclick="edit_data(this)">edit</a>'+
          '    <a class="dropdown-item" href="javascript:void(0)" data-id='+ data.id +' onclick="delete_data(this)">delete</a>'+
          '  </div>'+
          '</div>'+
          '</div>'+
          '                </div><!-- row -->'+
          '              </div><!-- file-item -->'+
          '');
      });

}

function edit_data (el) {

  $('#update_data_modal').modal('show');
  data_id = parseInt($(el).attr('data-id'));

  db.transaction('rw',  db.data, function* () {

      db.data.where('id')
      .equals(data_id)
      .each(function (data) {

          $('#update_data_alias').val(data.alias);
          $('#update_data_name').val(data.value);
          $('#submit_update_changes').attr('data-id', data.id);
          $('#update_data_name').attr('data-id', data.id);

          });

      }).catch (e => {
        console.error (e);
        });

}

function update_data (el) {
  data_id     = parseInt($(el).attr('data-id'));
  data_alias  = $('#update_data_alias').val();
  data_name   = $('#update_data_name').val();
  db.transaction('rw',  db.data, function* () {
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      db.data.where('id').equals(data_id).modify({alias: data_alias, value: data_name, date: date + ' ' + time})
      getData();
      $('#update_data_modal').modal('hide');
      }).catch (e => {
        console.error (e);
        });
}

function update_data_by_enter (el,e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
    // Do something
    update_data(el);
  }
}

function delete_data (el) {
  data_id = parseInt($(el).attr('data-id'));
  db.transaction('rw',  db.data, db.projects, function* () {
      db.data.where('id')
      .equals(data_id)
      .delete();
      getData();
        project_id = parseInt($('a.nav-link.active').attr('data-id'));

        db.data.where('project_id').equals(project_id).count(function (data) {
            return db.transaction("rw", db.projects, function () {
                db.projects.where('id').equals(project_id).modify({count: data})
                refreshProjects(project_id);
                
                }).catch(function (e) {
                  console.log(e, "error");
                  });
            });
      
      }).catch (e => {
        console.error (e);
        });
}

function getDatabyPage(){
  //do something special
  $('#load_more').hide();        
  project_id = parseInt($('a.nav-link.active').attr('data-id'));
  db.data.where('project_id').equals(project_id).count(function (data) {
      if (data > 10) {
      $('#load_more').show();        
      }
      });
  last_data_id = parseInt($('.file-item').last().attr('data-id'));


  db.data.where('project_id')
    .equals(project_id)
    .and(function (data) { return data.id < last_data_id})
    .limit(10)
    .reverse()
    .count(function (data) {

        if (data == 0) {
        $('#load_more').hide();        
        }

        });


  db.data.where('project_id')
    .equals(project_id)
    .and(function (data) { return data.id < last_data_id})
    .limit(10)
    .reverse()
    .each(function (data) {

        $('#data_list').append('' +
            '              <div class="file-item" data-id='+ data.id +'>'+
            '                <div class="row no-gutters wd-100p">'+
            '                  <div class="col-9 col-sm-5 d-flex align-items-center">'+
            data.alias +
            '                  </div><!-- col-6 -->'+
            '                  <div class="col-3 col-sm-2 tx-right tx-sm-left">'+ data.value +'</div>'+
            '                  <div class="col-6 col-sm-4 mg-t-5 mg-sm-t-0" title="'+ data.date +'">'+ jQuery.timeago(data.date) +'</div>'+
          '                  <div class="col-6 col-sm-1 tx-right mg-t-5 mg-sm-t-0"> '+
          '<div class="dropdown">'+
          '<a href="javascript:void(0)" class="" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="icon ion-more"></i></a>'+
          '  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'+
          '    <a class="dropdown-item" href="javascript:void(0)" data-id='+ data.id +' onclick="edit_data(this)">edit</a>'+
          '    <a class="dropdown-item" href="javascript:void(0)" data-id='+ data.id +' onclick="delete_data(this)">delete</a>'+
          '  </div>'+
          '</div>'+
          '</div>'+
            
            '                </div><!-- row -->'+
            '              </div><!-- file-item -->'+
            '');

        });

}

getProjects();

  setTimeout(
      function() 
      {
      getData();
      }, 1000);

function nav_click(el){
  $('.nav-link').removeClass("active");
  $(el).addClass('active');
  getData();
}

function new_project(el){
  $('#new_project_modal').modal('show');
}


function new_data(el){
  $('#new_data_modal').modal('show');
}

$('#form_project_name').parsley();


function save_project_by_enter(el,e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    // Do something
    save_project(el);
  }
}

function save_data_by_enter(el,e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
    // Do something
    save_data(el);
  }
}

function save_project (el) {
  project_name = $('#project_name').val();  
  if (project_name.trim() != '') {
    return db.transaction("rw", db.projects, function () {
        db.projects.add({ name: project_name, count:0});
        getProjects();
        $('#project_name').val('');
        $('#new_project_modal').modal('hide');
        // Log data from DB:
        }).catch(function (e) {
          console.log(e, "error");
          });
  }
  else  {
    return false;
  }
}


function save_data(el) {
  data_name = $('#data_name').val();  
  data_alias = $('#data_alias').val();  
  if (data_name.trim() != '') {
    return db.transaction("rw", db.data, db.projects, function () {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        project_id = parseInt($('a.nav-link.active').attr('data-id'));
        db.data.add({ alias: data_alias, value: data_name, date: date + ' ' + time, project_id: project_id});

        db.data.where('project_id').equals(project_id).count(function (data) {
            return db.transaction("rw", db.projects, function () {
                db.projects.where('id').equals(project_id).modify({count: data})
                }).catch(function (e) {
                  console.log(e, "error");
                  });
            });
        getData();
        setTimeout(
            function() 
            {
            refreshProjects(project_id);
            }, 1000);
        $('#data_alias').val('');
        $('#data_name').val('');
        $('#new_data_modal').modal('hide');
        // Log data from DB:
    }).catch(function (e) {
      console.log(e, "error");
      });
  }
  else  {
    return false;
  }
}


function load_more(el) {
  getDatabyPage();
}


function downloadBlob(blob, filename) {
  var anchor = document.createElement('a');
  anchor.setAttribute('download', filename);
  var url = URL.createObjectURL(blob);
  anchor.setAttribute('href', url);
  anchor.click();
  URL.revokeObjectURL(url);
}

function createCSVFileFromString(string) {
  var csv_mime_type = 'text/csv';
  return new Blob([string], {type: csv_mime_type});
}


async function export_csv (el) {
  project_id = parseInt($('a.nav-link.active').attr('data-id'));
  const alldata = await db.data
    .where('project_id').equals(project_id)
    .toArray();

  let csvContent = "data:text/csv;charset=utf-8,";

  csv_string = 'alias,value\n';
  /*var csvstring = toCSV(alldata);*/
  $(alldata).each(function( index, value) {
      csv_string += value.alias + ',' + value.value + '\n';
      });
  var blob = createCSVFileFromString(csv_string);
  downloadBlob(blob, 'project.csv');


}

function import_from_csv_link (el) {
        $('#upload_csv_modal').modal('show');
}

function submit_csv (el) {
  var csv = $('#filer_input');
  var csvFile = csv[0].files[0];
  var ext = csv.val().split(".").pop().toLowerCase();

  if($.inArray(ext, ["csv"]) === -1){
    alert('please upload right csv');
    return false;
  }

  if(csvFile != undefined){
    reader = new FileReader();
    reader.onload = function(e){

      csvResult = e.target.result.split(/\r|\n|\r\n/);
      true_format = true;

      if (csvResult[0] != 'alias,value') {
        true_format = false;
        alert('wrong csv format, please change');
      }

      if (true_format == true) {
        io = 0;
    return db.transaction("rw", db.data, db.projects, function () {
        $(csvResult).each(function( index, value) {

            if (io != 0) {
              spl_obj = value.split(',');
              if (spl_obj.length == 2) {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        project_id = parseInt($('a.nav-link.active').attr('data-id'));
        db.data.add({ alias: spl_obj[0], value: spl_obj[1], date: date + ' ' + time, project_id: project_id});

        db.data.where('project_id').equals(project_id).count(function (data) {
            return db.transaction("rw", db.projects, function () {
                db.projects.where('id').equals(project_id).modify({count: data})
                }).catch(function (e) {
                  console.log(e, "error");
                  });
            });
 



                }
            }

io++;

          });
        $('#upload_csv_modal').modal('hide');
        getData();
        setTimeout(
            function() 
            {
            refreshProjects(project_id);
            }, 1000);

    }).catch(function (e) {
      console.log(e, "error");
      });


        }


      /*$('.csv').append(csvResult);*/
    }
    reader.readAsText(csvFile);
  }


}



/*populateSomeData();*/
/*db.projects.orderBy('name').each(function (project) {*/
/*console.log(JSON.stringify(project));*/
/*});*/
