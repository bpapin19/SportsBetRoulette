import React, {useRef, useState, useEffect} from "react";
import {Form, Button, Card, Container, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery'
import './Home.css';
require('dotenv').config();

export default function Home() {

  // Use Ref
  const amountRef = useRef();

  // Use State
  const [sport, setSport] = useState("basketball_nba");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(-1);
  const [bookArray, setBookArray] = useState([]);
  const [game, setGame] = useState("");
  const [book, setBook] = useState({index:0, title: "Book"});
  const [market, setMarket] = useState("");
  const [outcome, setOutcome] = useState("");
  const [moneyline, setMoneyline] = useState("");
  const [spread, setSpread] = useState("");
  const [totals, setTotals] = useState("");

  var baseUrl = "https://api.the-odds-api.com";

  var marketArray = [];

  const NFL_Teams = [{full:"Arizona Cardinals", abbr:"ARI"}, {full:"Atlanta Falcons", abbr:"ATL"}, {full:"Baltimore Ravens", abbr:"BAL"},
                    {full:"Buffalo Bills", abbr:"BUF"}, {full:"Carolina Panthers", abbr:"CAR"}, {full:"Dallas Cowboys", abbr:"DAL"},
                    {full:"Cincinnati Bengals", abbr:"CIN"}, {full:"Cleveland Browns", abbr:"CLE"}, {full:"Chicago Bears", abbr:"CHI"},
                    {full:"Denver Broncos", abbr:"DEN"}, {full:"Detroit Lions", abbr:"DET"}, {full:"Green Bay Packers", abbr:"GB"},
                    {full:"Houston Texans", abbr:"HOU"}, {full:"Indianapolis Colts", abbr:"IND"}, {full:"Jacksonville Jaguars", abbr:"JAX"},
                    {full:"Kansas City Chiefs", abbr:"KC"}, {full:"Miami Dolphins", abbr:"MIA"}, {full:"Minnesota Vikings", abbr:"MIN"},
                    {full:"New England Patriots", abbr:"NE"}, {full:"New Orleans Saints", abbr:"NO"}, {full:"NY Giants", abbr:"NYG"},
                    {full:"NY Jets", abbr: "NYJ"}, {full:"Las Vegas Raiders", abbr:"LV"}, {full:"Philadelphia Eagles", abbr:"PHI"},
                    {full:"Pittsburgh Steelers", abbr:"PIT"}, {full:"Los Angeles Chargers", abbr:"LAC"}, {full:"San Francisco 49ers", abbr:"SF"},
                    {full:"Seattle Seahawks", abbr:"SEA"}, {full:"Los Angeles Rams", abbr:"LAR"}, {full:"Tampa Bay Buccaneers", abbr:"TB"},
                    {full:"Tennessee Titans", abbr:"TEN"}, {full:"Washington Football Team", abbr:"WAS"}
                  ];

  function buildSlotItem (text) {
    return $('<div>').addClass('slottt-machine-recipe__item')
                     .text(text);
}

function buildSlotContents ($container, gameArray) {
  var $items = gameArray.map(buildSlotItem);
  $container.append($items);
}

function popPushNItems ($container, n) {
    var $children = $container.find('.slottt-machine-recipe__item');
    $children.slice(0, n).insertAfter($children.last());

    if (n === $children.length) {
      popPushNItems($container, 1);
    }
}

// After the slide animation is complete, we want to pop some items off
// the front of the container and push them onto the end. This is
// so the animation can slide upward infinitely without adding
// inifinte div elements inside the container.
function rotateContents ($container, n) {
    setTimeout(function () {
      popPushNItems($container, n);
      $container.css({top: 0});
    }, 300);   
}
  
function animate(randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container');
  console.log(randNum);
  var wordIndex = randNum;
  $wordbox.animate({top: -wordIndex*150}, 500, 'swing', function () {
    rotateContents($wordbox, wordIndex);
  });
}

function spin(itemArray, randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container');
  buildSlotContents($wordbox, itemArray);
  
  setInterval(animate(randNum), 2000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
}

function removeElementsByClass(className){
  const elements = document.getElementsByClassName(className);
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

function getMarkets() {
  if (moneyline !== "") {
    marketArray.push(moneyline);
  }
  if (spread !== "") {
    marketArray.push(spread);
  }
  if (totals !== "") {
    marketArray.push(totals);
  }
  if (moneyline === "" && spread === "" && totals === "") {
    marketArray = ["h2h,spreads,totals"];
  }
  return marketArray;
}

  async function handleSubmit(e) {
      e.preventDefault();

      console.log(marketArray);

      var game_randNum;
      var market_randNum;
      var outcome_randNum;

      if (error === "") {
        if (document.getElementsByClassName('slottt-machine-recipe__item').length !== 0) {
          removeElementsByClass('slottt-machine-recipe__item');
        }
        setLoading(1);
        axios({
          method: 'get',
          url: baseUrl + `/v4/sports/${sport}/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us&markets=${getMarkets().toString()}&oddsFormat=american`,
        })
        .then(res => {
            console.log(res.data);
            game_randNum = (Math.floor(Math.random() * res.data.length));
            market_randNum = (Math.floor(Math.random() * res.data[game_randNum].bookmakers[book.index].markets.length));
            outcome_randNum = (Math.floor(Math.random() * res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes.length));
            setLoading(0);

            var gameArray = res.data.map(function(game) {
              return `${game.away_team} at ${game.home_team}`;
            });

            var marketArray = res.data[game_randNum].bookmakers[book.index].markets.map(function(market) {
              return `${market.key}`;
            });

            var outcomeArray = res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes.map(function(outcome) {
              return `${outcome.name}`;
            });

            spin(gameArray, game_randNum);
            spin(marketArray, market_randNum);
            spin(outcomeArray, outcome_randNum);

            setGame(res.data[game_randNum]);
            setMarket(res.data[game_randNum].bookmakers[book.index].markets[market_randNum]);
            setOutcome(res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes[outcome_randNum]);
        })
        .catch(function() {
          setError("Unable to generate bet");
        });

        // Clear state after submit
        setMoneyline("");
        setSpread("");
        setTotals("");

        // reset fields
        e.target.reset();
      }
    }

  const handleChange = e => {
    setSport(e.target.value);
    axios({
      method: 'get',
      url: baseUrl + `/v4/sports/${sport}/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`,
    })
    .then(res => {
      setBookArray(res.data[0].bookmakers);
      console.log(bookArray);
    }).catch(function() {
      setError("Unable to generate books");
    });
  };

  const handleMLSelect = e => {
      if (e.target.checked) {
        setMoneyline(e.target.value);
      } else {
        setMoneyline("");
      }   

      console.log(moneyline)
  };

  const handleSpreadSelect = e => {
    if (e.target.checked) {
      setSpread(e.target.value);
    } else {
      setSpread("");
    }   
  };

  const handleTotalSelect = e => {
    if (e.target.checked) {
      setTotals(e.target.value);
    } else {
      setTotals("");
    }
  };

  const borderStyles = {
    borderRadius: "10px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)"
  }

  return (
    <>
    <Container
            className="d-flex justify-content-center"
            style={{ minHeight: "100vh", paddingTop: "30px"}}
        >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          { success && 
          <div className="alert alert-success">{success}</div> }
          { error && 
          <div className="alert alert-danger">{error}</div> }
            <div style={ borderStyles }>
                <Card.Body>
                    <h2 className="text-center mb-4">Generate a Bet</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name" className="input-icon">
                            <Form.Label>Amount</Form.Label>
                            <i>$</i>
                            <Form.Control placeholder="0.00" ref={amountRef} />
                        </Form.Group>
                        <div className="row">
                          <div className="col">
                            <Form.Group id="type">
                            <Form.Label>Sport</Form.Label>
                              <Form.Check 
                                type={'radio'}
                                id={'Football'}
                                value={'americanfootball_nfl'}
                                label={'Football'}
                                name={'sport'}
                                onChange={handleChange}
                                required
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Basketball'}
                                value={'basketball_nba'}
                                label={'Basketball'}
                                name={'sport'}
                                onChange={handleChange}
                                required
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Baseball'}
                                value={'baseball_mlb'}
                                label={'Baseball'}
                                name={'sport'}
                                onChange={handleChange}
                                required
                              />
                          </Form.Group>
                          </div>
                          <div className="col">
                            <Form.Group>
                              <Form.Label>Bets</Form.Label>
                                <Form.Check 
                                  id={'moneyline'}
                                  value={'h2h'}
                                  label={'Moneyline'}
                                  name={'moneyline'}
                                  onChange={handleMLSelect}
                                />
                                <Form.Check 
                                  id={'spread'}
                                  value={'spreads'}
                                  label={'Spread'}
                                  name={'spreads'}
                                  onChange={handleSpreadSelect}
                                />
                                <Form.Check 
                                  id={'totals'}
                                  value={'totals'}
                                  label={'Totals'}
                                  name={'totals'}
                                  onChange={handleTotalSelect}
                                />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          {/* **************************** TEAM DROPDOWN *************************** */}
                          <div className="col">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic" style={{marginBottom: "20px"}}>
                                Game
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{overflow: "auto", maxHeight: "200px"}}>
                              <Dropdown.Item onClick={() => {setBook({index: 0, title: "Any"})}}>Any</Dropdown.Item>
                                {NFL_Teams.map(team =>
                                  <Dropdown.Item key={team.abbr} onClick={() => {setBook({index: bookArray.indexOf(team), title: team.title})}}>{team.abbr}</Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown> 
                          </div>

                          {/* **************************** BOOK DROPDOWN *************************** */}
                          <div className="col">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic" style={{marginBottom: "20px"}}>
                                {book.title}
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{overflow: "auto", maxHeight: "200px"}}>
                              <Dropdown.Item onClick={() => {setBook({index: 0, title: "Any"})}}>Any</Dropdown.Item>
                                {bookArray.map(bookName =>
                                  <Dropdown.Item key={bookName.key} onClick={() => {setBook({index: bookArray.indexOf(bookName), title: bookName.title})}}>{bookName.title}</Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <Button className="w-100" type="submit">Bet!</Button>
                    </Form>
                </Card.Body>
            </div>
            {loading===1 && 
            <div>
              <div>Generating Bet...</div>
            </div>}
            {loading===0 && 
            <div>
              <div>{game.away_team} <span>at {game.home_team}</span></div>
              <div>Market: {market.key}</div>
              <div>Outcome: {outcome.name}<span>{outcome.point}</span><span>{outcome.price}</span></div>
            </div>}
            <div class="slottt-machine-recipe">
              <div class="slottt-machine-recipe__mask" id="wordbox">
                <div class="slottt-machine-recipe__items_container recipe_if" id="slot_items_list"></div>
              </div>
            </div>
            <div class="slottt-machine-recipe">
              <div class="slottt-machine-recipe__mask" id="wordbox">
                <div class="slottt-machine-recipe__items_container recipe_if" id="slot_items_list"></div>
              </div>
            </div>
        </div>
        
    </Container>
    
    </>
  )
}