var db = new Dexie("RandPick");
db.version(5).stores({
projects: "++id,name,count"
});
db.version(4).stores({
data: "++id,project_id,alias,value,date"
});
db.open();


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
      if (io == 0) {
          $('#project_list').append(''+
            '  <a href="#project_'+ project.id +'" data-id="'+ project.id +'" class="nav-link active" onclick="nav_click(this)"> '+
            '   <span>'+ project.name +'</span> '+
            '    <span>'+ project.count +'</span> '+
            '  </a> '+
          '');
        }
        else{
          $('#project_list').append(''+
            '  <a href="#project_'+ project.id +'" data-id="'+ project.id +'"  class="nav-link" onclick="nav_click(this)"> '+
            '   <span>'+ project.name +'</span> '+
            '    <span>'+ project.count +'</span> '+
            '  </a> '+
          '');

          }
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
            '  <a href="#project_'+ project.id +'" data-id="'+ project.id +'"  class="nav-link '+ active +'" onclick="nav_click(this)"> '+
            '   <span>'+ project.name +'</span> '+
            '    <span>'+ project.count +'</span> '+
            '  </a> '+
          '');

      });

}


function getData(){
    //do something special
  $('#data_list').html('');
  project_id = parseInt($('a.nav-link.active').attr('data-id'));
  db.data.where('project_id').equals(project_id).reverse().each(function (data) {

  $('#data_list').append('' +
'              <div class="file-item">'+
'                <div class="row no-gutters wd-100p">'+
'                  <div class="col-9 col-sm-5 d-flex align-items-center">'+
data.alias +
'                  </div><!-- col-6 -->'+
'                  <div class="col-3 col-sm-2 tx-right tx-sm-left">'+ data.value +'</div>'+
'                  <div class="col-6 col-sm-4 mg-t-5 mg-sm-t-0" title="'+ data.date +'">'+ jQuery.timeago(data.date) +'</div>'+
'                  <div class="col-6 col-sm-1 tx-right mg-t-5 mg-sm-t-0"><a href=""><i class="icon ion-more"></i></a></div>'+
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



/*populateSomeData();*/
/*db.projects.orderBy('name').each(function (project) {*/
/*console.log(JSON.stringify(project));*/
/*});*/
