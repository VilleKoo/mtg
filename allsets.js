var config = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx"
  };

  firebase.initializeApp(config);

  const cardList = document.getElementById('cardlist');
  const dbRefObject = firebase.database().ref().child('sets');

  // dbRefObject.on('value', snap => {
  //   preObject.innerText = JSON.stringify(snap.val(), null, 3);
  // })

  // Helper functions 

      const manaCircle = (colorType = 'color', colorLess = '')=> {
            return `<span class="${colorType}">${colorLess}</span>`;
      };

      const mapObj = {
        '{T}': manaCircle('color', 'T'),
        '{X}': manaCircle('color', 'X'),
        '{R}': manaCircle('red'),
        '{B}': manaCircle('black'),
        '{G}': manaCircle('green'),
        '{W}': manaCircle('white'),
        '{U}': manaCircle('blue'),
      }

      const colorPattern =  /{U}|{T}|{X}|{R}|{B}|{G}|{W}/gi;

      const replacer = (item = '')=> {

        // Find the colorless mana in manacost
        const cStr = item.replace(/{C}/g, (match, offset, all)=> {
          const count = (item.match(/{C}/g) || []).length;
          return match === "{C}" ? (all.indexOf("{C}") === offset ? manaCircle('color',`${count}`) : '') : ''; 
        });

        // Find mana colors in Manacost & Card text
        const b = cStr.replace(colorPattern, (matched)=> {
          return mapObj[matched];
        });

        // Find colorless Mana, X and Tap in Card text
        const c = b.replace(/{\d+}/gi, (match)=> {
          const u = match.replace(/{|}/gi, '');
          return `<span class="color">${u}</span>`;
        });

        return c;
        
      }

  const els = [];
  
  dbRefObject.on("value", snap => {
    const sets = snap.forEach((setSnapshot)=> {
      
      const key = setSnapshot.key;
      const setData = setSnapshot.val();

      const setName = setData.name;
      const setList = document.createElement('ul');
      setList.innerHTML = `<h1>${setName} - ${setData.releaseDate}</h1>`;

      document.querySelector('body').appendChild(setList);

      const cards = setData.cards;
      
      const cardData = cards.forEach((cardSnapshot)=>{
        const cardName = cardSnapshot.name;
        const cardType = cardSnapshot.type ? cardSnapshot.type : '';
        const cardText = replacer(cardSnapshot.text);
        const cardRarity = cardSnapshot.rarity;
        //const cardClass = cardSnapshot.color + ' ' + cardSnapshot.type;
        const cardManaCost = replacer(cardSnapshot.manaCost);

        const listEl = document.createElement('li');
        listEl.setAttribute('id', cardSnapshot.key);
        const el = `
          <div class="card">
            <p>${cardManaCost}</p>
            <p>${cardName}</p>
            <p>${cardType}</p>
            <p>${cardRarity}</p>
            <div class="card--info">
              <p>${cardText}</p>
            </div>
          </div>
        `;
        listEl.innerHTML = el;
        els.push(listEl);
        setList.appendChild(listEl);
      });
    })
  });

  els.forEach(function(){
    console.log('boo');
  });

  
