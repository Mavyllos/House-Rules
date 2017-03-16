// var result = parser.xml_str2json('<person><name>Wes</name></person>')
// console.log(result);

// $.ajax({
//   ...
// }).then(function (result) {
//   var parser = new X2JS()
//   var result = parser.xml_str2json(result.xml)
//   // result is your json object
// })

var corsApi = 'http://galvanize-cors-proxy.herokuapp.com/';
var searchResultJSON;
$('form').submit(function(e) {
    e.preventDefault();

    var searchstring = $('.input-sm').val();
    var url = corsApi + 'https://www.boardgamegeek.com/xmlapi/search?search=' + searchstring;

    $.ajax({
        method: "GET",
        url: url
    }).then(function(result) {
        var parser = new X2JS();
        result = parser.xml2json(result);
        // console.log(JSON.stringify(result));


        for (var i = 0; i < result.boardgames.boardgame.length; i++) {
            var gameTitle = result.boardgames.boardgame[i].name.__text;
            var objId = result.boardgames.boardgame[i]._objectid;
            // console.log(objId);

            $(".modal-body").prepend($(`<p>${gameTitle}<button type="button" class="btn btn-primary btn-xs gameinfo" id="${objId} ">Add Game</button></p>`));
        }

        $("#myModal").modal('show');

        $('.gameinfo').on('click', function(e) {
            e.preventDefault();

            var idUrl = corsApi + `https://www.boardgamegeek.com/xmlapi/boardgame/${$(this).attr('id')}`;
            // console.log(idUrl);

            $.ajax({
                method: "GET",
                url: idUrl
            }).then(function(idResult) {
                var parser = new X2JS();
                idResult = parser.xml2json(idResult);
                // console.log(idResult);
                // console.log(JSON.stringify(idResult));
                // console.log(idResult.boardgames.boardgame);

                var thumbnailImg = idResult.boardgames.boardgame.thumbnail;
                var minPlayers = idResult.boardgames.boardgame.minplayers;
                var maxPlayers = idResult.boardgames.boardgame.maxplayers;
                var playingTime = idResult.boardgames.boardgame.playingtime;
                var objectId = idResult.boardgames.boardgame._objectid;
                var gameName;

                if (Array.isArray(idResult.boardgames.boardgame.name)) {
                  for (var i = 0; i < idResult.boardgames.boardgame.name.length; i++) {
                    idResult.boardgames.boardgame.name[i];
                    if (idResult.boardgames.boardgame.name[i]._primary) {
                      gameName = idResult.boardgames.boardgame.name[i].__text;
                    }
                  }
                } else {
                  gameName = idResult.boardgames.boardgame.name.__text;
                }

                $(".games-row").prepend($(`
                  <div class="col-xs-8 portfolio-item">
                      <a href="#">
                          <img class="img-responsive" src="http:${thumbnailImg}" alt="">
                      </a>
                      <h4>
                        <a href="#" class="game-name">${gameName}</a>
                      </h4>
                      <div class="game-data">
                          <p class="players"><strong>Suggested Players -</strong> <br><span>Min :</span> ${minPlayers} <br><span>Max :</span> ${maxPlayers}
                          </p>
                          <p class="play-time"><strong>Play Time: </strong> <br> ${playingTime}
                          </p>
                          <a class="rulez-collapse" data-toggle="collapse" href="#rulez${objectId}" aria-expanded="false" aria-controls="rulez${objectId}"> View, Add, or Edit Rulez </a>
                          <ul>
                              <div class="rulez collapse" id="rulez${objectId}" aria-expanded="false">
                                  <div class="card card-block">
                                      <!-- collapse data goes here  -->
                                      <br>
                                      <div class="panel-group" id="accordionRulez${objectId}" role="tablist" aria-multiselectable="true">
                                          <div class="panel panel-default">
                                              <div class="panel-heading" role="tab" id="headingOne">
                                                  <h2 class="panel-title">
                                          <a role="button" data-toggle="collapse" data-parent="#accordionRulez${objectId}" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Add a New Rule
                                          </a>
                                        </h2>
                                              </div>
                                              <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                                  <div class="panel-body">
                                                      <form action="#">
                                                          <div class="row">
                                                              <div class="col-md-3">
                                                                  <div class="form-group form-group-sm">
                                                                      <label for="ruleTitle" class="control-label">Rule  Title</label>
                                                                      <input type="text" class="form-control" id="ruleTitle" placeholder="Enter Rule Title">
                                                                  </div>
                                                              </div>
                                                              <div class="col-md-3">
                                                                  <div class="form-group">
                                                                      <label for="ruleCategory" class="control-label">Rule Category</label>
                                                                      <textarea class="form-control" id="ruleCategory" placeholder="Enter Rule Category"></textarea>
                                                                  </div>
                                                              </div>
                                                              <div class="col-md-3">
                                                                  <div class="form-group">
                                                                      <label for="ruleText" class="control-label">Rule Text</label>
                                                                      <textarea class="form-control" id="ruleText" placeholder="Enter Rule Text"></textarea>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div class="row">
                                                              <div class="col-xs-3">
                                                                  <button type="submit" class="btn btn-default">Submit</button>
                                                              </div>
                                                          </div>
                                                      </form>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <!-- collapse data ends -->
                          </ul>
                          <a class="errata-collapse" data-toggle="collapse" href="#errata${objectId}" aria-expanded="false" aria-controls="errata${objectId}"> View, Add, or Edit Errata </a>
                          <ul>
                              <div class="collapse" id="errata${objectId}" aria-expanded="false">
                                  <div class="card card-block">
                                      <!-- collapse data goes here  -->
                                      <br>
                                      <div class="panel-group" id="accordionErrata${objectId}" role="tablist" aria-multiselectable="true">
                                          <div class="panel panel-default">
                                              <div class="panel-heading" role="tab" id="headingTwo">
                                                  <h2 class="panel-title">
                                          <a role="button" data-toggle="collapse" data-parent="#accordionErrata${objectId}" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                            Add New Errata
                                          </a>
                                        </h2>
                                              </div>
                                              <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                                                  <div class="panel-body">
                                                      <form action="#">
                                                          <div class="row">
                                                              <div class="col-md-3">
                                                                  <div class="form-group form-group-sm">
                                                                      <label for="errataTitle" class="control-label">Card  Title</label>
                                                                      <input type="text" class="form-control" id="errataTitle" placeholder="Enter Card Name">
                                                                  </div>
                                                              </div>
                                                              <div class="col-md-3">
                                                                  <div class="form-group">
                                                                      <label for="cardText" class="control-label">Card  Text</label>
                                                                      <textarea class="form-control" id="cardText" placeholder="Enter Card Text"></textarea>
                                                                  </div>
                                                              </div>
                                                              <div class="col-md-3">
                                                                  <div class="form-group">
                                                                      <label for="cardRuling" class="control-label">Card Ruling</label>
                                                                      <textarea class="form-control" id="cardRuling" placeholder="Enter Card Ruling"></textarea>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div class="row">
                                                              <div class="col-xs-3">
                                                                  <button type="submit" class="btn btn-default">Submit</button>
                                                              </div>
                                                          </div>
                                                      </form>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <!-- collapse data ends -->
                          </ul>
                      </div>
                  </div>`));
            });
        });
    });
});

// function deleteRow(row)
// {
//     var i=row.parentNode.parentNode.rowIndex;
//     document.getElementById('rulezTable').deleteRow(i);
// }
//
//
// function insRow()
// {
//     console.log( 'hi');
//     var x=document.getElementById('rulezTable');
//     var new_row = x.rows[1].cloneNode(true);
//     var len = x.rows.length;
//     new_row.cells[0].innerHTML = len;
//
//     var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
//     inp1.id += len;
//     inp1.value = '';
//     var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
//     inp2.id += len;
//     inp2.value = '';
//     x.appendChild( new_row );
// }
