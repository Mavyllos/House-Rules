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
                            <div id="rulezTableDiv">
                            <br>
                                <table id="rulezTable" border="1">
                                    <tr>
                                        <td>ID</td>
                                        <td>Rule Title</td>
                                        <td>Rule Text</td>
                                        <td>Delete?</td>
                                        <td>Add Rows?</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>

                                        <td><input size=25 type="text" id="title" class="textFields"/></td>

                                        <td><input size=25 type="text" id="ruleText" class="textFields"/></td>

                                        <td><input type="button" id="delbutton" value="Delete" class="textFields" onclick="deleteRow(this)"/></td>

                                        <td><input type="button" id="addmorebutton" class="textFields" value="Add More Rulez" onclick="insRow()"/></td>
                                    </tr>
                                </table>
                            </div>
                            </div>
                          </div>
                        </ul>
                        <a class="errata-collapse" data-toggle="collapse" href="#errata${objectId}" aria-expanded="false" aria-controls="errata${objectId}"> View, Add, or Edit Errata </a>
                        <ul>
                          <div class="collapse" id="errata${objectId}" aria-expanded="false">
                            <div class="card card-block">
                            <div id="rulezTableDiv">
                            <br>
                                <table id="rulezTable" border="1">
                                    <tr>
                                        <td>ID</td>
                                        <td>Card Title</td>
                                        <td>Card Text</td>
                                        <td>Card Ruling</td>
                                        <td>Delete?</td>
                                        <td>Add Rows?</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>

                                        <td><input size=25 type="text" class="textFields" id="title"/></td>

                                        <td><input size=25 type="text" id="ruleText" class="textFields"/></td>

                                        <td><input size=25 type="text" id="rulingText" class="textFields"/></td>

                                        <td><input type="button" id="delbutton" class="textFields" value="Delete" onclick="deleteRow(this)"/></td>

                                        <td><input type="button" id="addmorebutton" class="textFields" value="Add More Errata" onclick="insRow()"/></td>
                                    </tr>
                                </table>
                            </div>
                            </div>
                          </div>
                        </ul>
                    </div>
                </div>`));
                // $(document).ready(function() {
                //   $('.rulez-collapse').collapse("hide");
                //   $('.errata-collapse').collapse("hide");
                // });
            });
        });
    });
});

function deleteRow(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('rulezTable').deleteRow(i);
}


function insRow()
{
    console.log( 'hi');
    var x=document.getElementById('rulezTable');
    var new_row = x.rows[1].cloneNode(true);
    var len = x.rows.length;
    new_row.cells[0].innerHTML = len;

    var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
    inp1.id += len;
    inp1.value = '';
    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
    inp2.id += len;
    inp2.value = '';
    x.appendChild( new_row );
}
