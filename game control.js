var deck = [];
var message = 0;
var message_cnt = 1;

var hidden_card = 0;
var dealer_point = 0;
var dealer_ace_cnt = 0;

var player_point = 0;
var player_ace_cnt = 0;
var player_card_cnt = 0;
var player_burst = 0;
var player_bet = 5000;
var bet_amount = 0;
var player_card_1 = 0;
var player_card_2 = 0;

var split_point = 0;
var split_ace_cnt = 0;
var split_card_cnt = 0;
var split_burst = 0;
var player_stand = 0;
var split_stand = 0;

const player = 0;
const split = 1;

var cheat_mode_on = 0;

var thead = document.createElement('thead');
var tbody = document.createElement('tbody');

window.onload = function(){//add event listener of button and write table head
    $('#send_bet').click(Bet);
    $('#hit').click(Player_hit);
    $('#stand').click(Stand);
    $('#next_game').click(Next);
    $('#surrender').click(Surrender);
    $('#double').click(Double);
    $('#split').click(Split);

    $('#split_hit').click(Split_hit);
    $('#split_stand').click(function(){
        Split_stand(1);
    });

    $('#split_hit_main').click(Split_hit_main);
    $('#split_stand_main').click(function(){
        Split_stand(0);
    });

    $('#cheat').click(Cheat);
    
    $('#table_field').append(thead);
    $('#table_field').append(tbody);

    let head_1 = $('<th>').text("編號");
    let head_2 = $('<th>').text("玩家目前點數");
    let head_3 = $('<th>').text("持有賭金");
    let head_4 = $('<th>').text("狀態訊息");
    let row_1 = $('<tr>').append(head_1);
    $(row_1).append(head_2);
    $(row_1).append(head_3);
    $(row_1).append(head_4);
    $(thead).append(row_1);

    Create_deck();
    Shuffle();
    Main_game();
}

function Create_deck(){
    let deck_num = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
    let deck_pattern = ["S", "H", "D", "C"];
    
    for(let k=0;k<4;k++){
        for(let i=0;i<deck_num.length;i++){
            for(let j=0;j<deck_pattern.length;j++){
                deck.push(deck_num[i]+deck_pattern[j]);
            }
        }   
    }
}

function Shuffle(){
    for (let i=deck.length-1;i>0;i--){
        let j = Math.floor(Math.random()*(i+1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }

    Write_table("洗牌");
}

function Cheat(){
    let deck_num = ["A", "T", "J", "Q", "K"];
    let deck_pattern = ["S", "H", "D", "C"];
    
    deck = [];
    for(let i=0;i<deck_num.length;i++){
        for(let j=0;j<deck_pattern.length;j++){
            deck.push(deck_num[i]+deck_pattern[j]);
        }
    }
    
    for (let i=deck.length-1;i>0;i--){
        let j = Math.floor(Math.random()*(i+1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    
    Write_table("作弊洗牌");

    cheat_mode_on = 1;
    $('#cheat').hide();
}

function Main_game(){
    $('#send_bet').prop('disabled', false);
    $('#bet_amount').prop('disabled', false);

    let img_1 = $("<img>").attr("src", "./PNG-cards-1.3/a_blank.png");
    $('#dealer_cards').append(img_1);

    let img_2 = $("<img>").attr("src", "./PNG-cards-1.3/a_blank.png");
    $('#player_cards').append(img_2);
    
    $('#result').html("勝負判定");
    $('#split_field').hide();
    $('#split_hit_main').hide();
    $('#split_stand_main').hide();

    $('#hit').prop('disabled', true);
    $('#stand').prop('disabled', true);
    $('#double').prop('disabled', true);
    $('#split').prop('disabled', true);
    $('#surrender').prop('disabled', true);
    $('#next_game').prop('disabled', true);

    $('#have_bet').html(player_bet);
    $('#remain_card').html(deck.length);
}

function Get_point(card){
    if(card[0] == 'A')
        return 11;
    else if(card[0] == 'T' || card[0] == 'J' || card[0] == 'Q' || card[0] == 'K')
        return 10;
    else
        return parseInt(card[0]);
}

function Ace_counter(num){
    if(num == 'A')
        return 1;
    else
        return 0;
}

function Dealer_hit(){
    let card = 0;

    if(cheat_mode_on == 1){
        let all_ten_point = deck.filter(function(card_in_deck) {
            return card_in_deck[0][0] != 'A';
        });

        card = all_ten_point.pop();
        deck.splice(deck.indexOf(card), 1);
    }
    else{
        card = deck.pop();
    }

    $('#remain_card').html(deck.length);
    let img = $("<img>").attr("src", "./PNG-cards-1.3/" +card+ ".png");

    dealer_ace_cnt += Ace_counter(card[0]);
    dealer_point += Get_point(card);

    if(dealer_point > 21 && dealer_ace_cnt > 0){
        dealer_ace_cnt--;
        dealer_point -= 10;
    }

    $("#dealer_cards").append(img);
    Write_table("莊家抽牌-" +card);
    return;
}

function Player_hit(){
    if(player_point == 11 && player_card_cnt == 2){
        $('#double').prop('disabled', true);
    }

    $('#surrender').prop('disabled', true);
    $('#split').prop('disabled', true);

    let card = 0;
    if(player_point < 21){
        if(cheat_mode_on == 1){
            let all_ten_point = deck.filter(function(card_in_deck) {
                return card_in_deck[0][0] != 'A';
            });

            card = all_ten_point.pop();
            deck.splice(deck.indexOf(card), 1);
        }
        else{
            card = deck.pop();
        }

        player_card_cnt++;
        $("#remain_card").html(deck.length);
        let img = $("<img>").attr("src", "./PNG-cards-1.3/" +card+ ".png");
        
        player_ace_cnt += Ace_counter(card[0]);
        player_point += Get_point(card);

        if(player_point > 21 && player_ace_cnt > 0){
            player_ace_cnt--;
            player_point -= 10;
        }

        $("#player_cards").append(img);
        $("#player_now_point").html(player_point);
        Write_table("玩家抽牌-" +card);

        if(player_card_cnt == 1)
            player_card_1 = card;
        else if(player_card_cnt == 2)
            player_card_2 = card;

        if(player_point > 21){
            $("#player_now_point").append("-burst");
            Write_table("玩家爆牌");
            player_burst = 1;
            Stand();
        }
        else if(player_point == 21){
            Write_table("21點-停牌");
            Stand();
        }
    }

    return;
}

function Stand(){
    Write_table("停牌 莊家開牌-" +hidden_card);

    $('#hit').prop('disabled', true);
    $('#stand').prop('disabled', true);
    $('#surrender').prop('disabled', true);
    $('#split').prop('disabled', true);

    if(player_burst == 0){
        while(dealer_point < 17)
            Dealer_hit();
    }

    $("#hidden_card").attr("src", "./PNG-cards-1.3/" +hidden_card+ ".png");
    $("#result").append("-莊家點數:  " +dealer_point);
    Write_table("莊家點數:  " +dealer_point);

    if(player_point == 21 && player_card_cnt == 2 && player_point != dealer_point){
        message = "-玩家得到Black Jack!";
        player_bet += bet_amount * 2.5;
        Write_table("玩家得到Black Jack");
    }
    else if((player_point < dealer_point && dealer_point <= 21) || (dealer_point <= 21 && player_point > 21)){
        message = "-莊家獲勝";
        Write_table("莊家獲勝");
    }
    else if((player_point > dealer_point && player_point <= 21) || (dealer_point > 21 && player_point <= 21)){
        message = "-玩家獲勝";
        player_bet += bet_amount * 2;
        Write_table("玩家獲勝");
    }
    else{
        message = "-平手";
        player_bet += bet_amount;
        Write_table("平手");
    }
    
    $("#have_bet").html(player_bet);
    $("#result").append(message);

    if(player_bet <= 0){
        $("#result").append("-玩家已失去所有賭注 遊戲結束");
        Write_table("玩家已失去所有賭注 遊戲結束");

        $('#next_game').prop('disabled', true);
        $('#hit').prop('disabled', true);
        $('#stand').prop('disabled', true);
        $('#double').prop('disabled', true);
    }
    else{
        $('#next_game').prop('disabled', false);
    }

    return;
}

function Next(){
    if(cheat_mode_on == 1){
        Cheat();
    }
    else if(deck.length <= 104){
        deck = [];
        Create_deck();
        Shuffle();
    }

    hidden_card = 0;
    dealer_point = 0;
    dealer_ace_cnt = 0;
    bet_amount = 0;

    player_point = 0;
    player_ace_cnt = 0;
    player_card_cnt = 0
    player_burst = 0;

    player_card_1 = 0;
    player_card_2 = 0;

    split_point = 0;
    split_ace_cnt = 0;
    split_card_cnt = 0;
    split_burst = 0;
    player_stand = 0;
    split_stand = 0;

    $("#result").html("勝負判定");

    $("#dealer_cards").html("");
    $("#player_cards").html("");
    $("#split_cards").html("");
    $("#split_field").hide();

    $("#player_now_point").html("");
    $("#bet_on").html("");

    Write_table("開始下一局");
    Main_game();
}

function Bet(){
    $('#cheat').prop("disabled", true);

    bet_amount = parseInt($("#bet_amount").val());
    if(bet_amount <= 0){
        Write_table("錯誤-小於0");
        return;
    }
    else if(isNaN(bet_amount) == 1){
        Write_table("輸入錯誤");
        return;
    }
    else if(bet_amount > player_bet){
        Write_table("錯誤-大於持有賭金");
        return;
    }

    player_bet -= bet_amount;
    $("#have_bet").html(player_bet);
    $("#bet_on").html(bet_amount);

    Write_table("下注" +bet_amount);

    $("#dealer_cards").html("");
    $("#player_cards").html("");

    let img = $("<img>").attr("src", "./PNG-cards-1.3/card_back.jpg");
    $(img).attr('id', 'hidden_card');
    $("#dealer_cards").append(img);

    Write_table("莊家蓋牌");
    if(cheat_mode_on == 1){
        let all_ace = deck.filter(function(card_in_deck) {
            return card_in_deck[0][0] == 'A';
        });

        hidden_card = all_ace.pop();
        deck.splice(deck.indexOf(hidden_card), 1);
    }
    else{
        hidden_card = deck.pop();
    }

    $("#remain_card").html(deck.length);
    dealer_point += Get_point(hidden_card);
    dealer_ace_cnt += Ace_counter(hidden_card[0]);

    Dealer_hit();
    Player_hit();
    Player_hit();

    if(player_point != 21){
        $("#surrender").prop('disabled', false);
        $("#hit").prop('disabled', false);
        $("#stand").prop('disabled', false);
    }

    $("#result").show();

    $("#bet_amount").prop('disabled', true);
    $("#send_bet").prop('disabled', true);

    if(player_point == 11){
        $("#double").prop('disabled', false);
    }

    if(Get_point(player_card_1) == Get_point(player_card_2)){
        $("#split").prop('disabled', false);
    }
}

function Surrender(){
    player_bet += bet_amount / 2;
    if(player_bet <= 0){
        $("#result").append("-玩家已失去所有賭注 遊戲結束");
        Write_table("玩家已失去所有賭注 遊戲結束");

        $('#next_game').prop("disabled", true);
        $('#hit').prop("disabled", true);
        $('#stand').prop("disabled", true);
        $('#double').prop("disabled", true);
        $('#surrender').prop("disabled", true);

        return;
    }

    Write_table("玩家認輸");
    Next();
}

function Double(){
    $('#cheat').prop("disabled", true);

    player_bet -= bet_amount;
    bet_amount *= 2;
    $("#bet_on").html(bet_amount);
    Write_table("雙倍下注");
    Player_hit();
    if(player_point < 21)
        Stand();
    return;
}
//work here
function Write_table(message){
    let row = document.createElement('tr');
    if(message_cnt % 2 == 0)
        row.setAttribute('class', 'even_row');
    else
        row.setAttribute('class', 'odd_row');

    let row_data_1 = $('<td>').html(message_cnt);
    let row_data_2 = $('<td>').html(player_point);
    let row_data_3 = $('<td>').html(player_bet);
    let row_data_4 = $('<td>').html(message);
    $(row).append(row_data_1);
    $(row).append(row_data_2);
    $(row).append(row_data_3);
    $(row).append(row_data_4);
    $(tbody).append(row);

    $(".another")[0].scrollTop = $(".another")[0].scrollHeight;

    message_cnt++;
}

function Write_table_split(message){
    let row = document.createElement('tr');
    if(message_cnt % 2 == 0)
        row.setAttribute('class', 'even_row');
    else
        row.setAttribute('class', 'odd_row');

    let row_data_1 = $('<td>').html(message_cnt);
    let row_data_2 = $('<td>').html(player_point);
    let row_data_3 = $('<td>').html(player_bet);
    let row_data_4 = $('<td>').html(message);
    $(row).append(row_data_1);
    $(row).append(row_data_2);
    $(row).append(row_data_3);
    $(row).append(row_data_4);
    row.classList.add('split_table');
    $(tbody).append(row);

    $(".another")[0].scrollTop = $(".another")[0].scrollHeight;

    message_cnt++;
}

function Split(){
    $("#split").prop("disabled", true);
    $("#surrender").prop("disabled", true);
    $("#hit").prop("disabled", true);
    $("#stand").prop("disabled", true);

    $("#split_field").show();
    $("#split_hit_main").show();
    $("#split_stand_main").show();
    $("#split_hit").show();
    $("#split_stand").show();

    player_bet -= bet_amount;
    $("#have_bet").html(player_bet);
    $("#bet_on").html(bet_amount*2);
    Write_table("分牌 加注");

    $("#player_cards").html("");
    let img_1 = $("<img>").attr("src", "./PNG-cards-1.3/" +player_card_1+ ".png");
    $("#player_cards").append(img_1);
    player_point = Get_point(player_card_1);
    player_card_cnt = 1;

    $("#split_cards").html("");
    let img_2 = $("<img>").attr("src", "./PNG-cards-1.3/" +player_card_2+ ".png");
    $("#split_cards").append(img_2);
    split_point = Get_point(player_card_2);
    split_card_cnt = 1;
}

function Split_hit(){
    if(split_point < 21){
        let card = 0;

        if(cheat_mode_on == 1){
            let all_ten_point = deck.filter(function(card_in_deck) {
                return card_in_deck[0][0] != 'A';
            });

            card = all_ten_point.pop();
            deck.splice(deck.indexOf(card), 1);
        }
        else{
            card = deck.pop();
        }
        
        split_card_cnt++;
        $("#remain_card").html(deck.length);
        let img = $("<img>").attr("src", "./PNG-cards-1.3/" +card+ ".png");
        
        split_ace_cnt += Ace_counter(card[0]);
        split_point += Get_point(card);

        if(split_point > 21 && split_ace_cnt > 0){
            split_ace_cnt--;
            split_point -= 10;
        }

        $("#split_cards").append(img);
        Write_table_split("分牌抽牌-" +card);

        if(split_point > 21){
            Write_table_split("分牌爆牌");
            split_burst = 1;
            split_stand = 1;
            Split_stand(2);
        }
        else if(split_point == 21){
            Write_table_split("21點-停牌");
            split_stand = 1;
            Split_stand(2);
        }
        
        if(Get_point(player_card_2) == 11){
            Write_table_split("分牌強制停牌");
            split_stand = 1;
            Split_stand(2);
        }
    }
    return;
}

function Split_hit_main(){
    if(player_point < 21){
        let card = 0;

        if(cheat_mode_on == 1){
            let all_ten_point = deck.filter(function(card_in_deck) {
                return card_in_deck[0][0] != 'A';
            });

            card = all_ten_point.pop();
            deck.splice(deck.indexOf(card), 1);
        }
        else{
            card = deck.pop();
        }

        player_card_cnt++;
        $("#remain_card").html(deck.length);
        let img = $("<img>").attr("src", "./PNG-cards-1.3/" +card+ ".png");
        
        player_ace_cnt += Ace_counter(card[0]);
        player_point += Get_point(card);

        if(player_point > 21 && player_ace_cnt > 0){
            player_ace_cnt--;
            player_point -= 10;
        }

        $("#player_now_point").html(player_point);

        $("#player_cards").append(img);
        Write_table("玩家抽牌-" +card);

        if(player_point > 21){
            Write_table("玩家爆牌");
            player_burst = 1;
            player_stand = 1;
            Split_stand(2);
        }
        else if(player_point == 21){
            Write_table("21點-停牌");
            player_stand = 1;
            Split_stand(2);
        }
        
        if(Get_point(player_card_1) == 11){
            Write_table("玩家強制停牌");
            player_stand = 1;
            Split_stand(2);
        }
    }
    return;
}

//which_cards: 0=player 1=split 2=burst or 21
function Split_stand(which_cards){
    if(which_cards == 0){
        player_stand = 1;
        Write_table("玩家停牌");
    }
        
    if(which_cards == 1){
        split_stand = 1;
        Write_table_split("分牌停牌");
    }

    //console.log("which_cards:" +which_cards+ "/player_stand:" +player_stand+ "/split_stand:" +split_stand);

    if(player_stand == 0 || split_stand == 0){
        Write_table("有分牌尚未停牌");
        return;
    }

    Write_table("全分牌停牌 莊家開牌-" +hidden_card);
    $("#split_hit_main").hide();
    $("#split_stand_main").hide();
    $("#split_hit").hide();
    $("#split_stand").hide();

    if(player_burst == 0 || split_burst == 0){
        while(dealer_point < 17)
            Dealer_hit();
    }

    $("#hidden_card").attr("src", "./PNG-cards-1.3/" +hidden_card+ ".png");
    $("#result").append("-莊家點數:  " +dealer_point);
    Write_table("莊家點數:  " +dealer_point);

    if(player_point == 21 && player_card_cnt == 2 && player_point != dealer_point){
        message = "-玩家得到Black Jack!";
        player_bet += bet_amount * 2.5;
        Write_table("玩家得到Black Jack");
    }
    else if((player_point < dealer_point && dealer_point <= 21) || (dealer_point <= 21 && player_point > 21)){
        message = "-玩家落敗";
        Write_table("玩家落敗");
    }
    else if((player_point > dealer_point && player_point <= 21) || (dealer_point > 21 && player_point <= 21)){
        message = "-玩家獲勝";
        player_bet += bet_amount * 2;
        Write_table("玩家獲勝");
    }
    else{
        message = "-玩家平手";
        player_bet += bet_amount;
        Write_table("玩家平手");
    }

    if(split_point == 21 && split_card_cnt == 2 && split_point != dealer_point){
        //message = "-二得到Black Jack!";
        player_bet += bet_amount * 2.5;
        Write_table_split("分牌得到Black Jack");
    }
    else if((split_point < dealer_point && dealer_point <= 21) || (dealer_point <= 21 && split_point > 21)){
        //message = "-分牌落敗";
        Write_table_split("分牌落敗");
    }
    else if((split_point > dealer_point && split_point <= 21) || (dealer_point > 21 && split_point <= 21)){
        //message = "-分牌獲勝";
        player_bet += bet_amount * 2;
        Write_table_split("分牌獲勝");
    }
    else{
        //message = "-分牌平手";
        player_bet += bet_amount;
        Write_table_split("分牌平手");
    }
    
    
    $("#have_bet").html(player_bet);
    $("#result").append(message);

    if(player_bet <= 0){
        $("#result").append("-玩家已失去所有賭注 遊戲結束");
        Write_table("玩家已失去所有賭注 遊戲結束");
        $('#next_game').prop("disabled", true);
    }
    else{
        $("#next_game").show();
        $('#next_game').prop("disabled", false);
    }

    return;
}