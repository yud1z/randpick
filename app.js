var db = new Dexie("RandPick");
db.version(1).stores({
projects: "++id,name"
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
            '  <a href="#project_'+ project.id +'" class="nav-link active" onclick="nav_click(this)"> '+
            '   <span>'+ project.name +'</span> '+
            '    <span>0</span> '+
            '  </a> '+
          '');
        }
        else{
          $('#project_list').append(''+
            '  <a href="#project_'+ project.id +'" class="nav-link" onclick="nav_click(this)"> '+
            '   <span>'+ project.name +'</span> '+
            '    <span>0</span> '+
            '  </a> '+
          '');

          }
      io++;
      });

}

getProjects();

function nav_click(el){
    $('.nav-link').removeClass("active");
    $(el).addClass('active');
}

function new_project(el){
  $('#new_project_modal').modal('show');
  }

$('#form_project_name').parsley();

function save_project (el) {
    project_name = $('#project_name').val();  
    if (project_name.trim() != '') {
      return db.transaction("rw", db.projects, function () {
          db.projects.add({ name: project_name});
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



/*populateSomeData();*/
/*db.projects.orderBy('name').each(function (project) {*/
/*console.log(JSON.stringify(project));*/
/*});*/
