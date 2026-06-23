import React, { useState } from "react";
import './style.css';

const product_list = [
   { id: 'burger', name: 'Burger', price: 12, img: 'burger.png'},
   { id: 'pizza', name: 'Pizza', price: 15, img: 'pizza.png'},
   { id: 'fries', name: 'Fries', price: 5, img: 'fries.png'},
   { id: 'nuggets', name: 'Nuggets', price: 7 , img: 'nuggets.png'},
   { id: 'buritto', name: 'Buritto', price: 10, img: 'buritto.png'},
   { id: 'coke', name: 'Soda', price: 3 , img: 'coke.png'},
   { id: 'coffee', name: 'Coffee', price: 5, img: 'COFFEE.png'},
   { id: 'chocolateicecream', name: 'Chocolate Ice Cream', price: 6, img: 'ICE CREAM.png'},
   { id: 'vanillaicecream', name: 'Vanilla Ice Cream', price: 6, img: 'vanilla.png'},
   { id: 'strawberryicecream', name: 'Strawberry Ice Cream', price: 6, img: 'strawberry.png'},
   { id: 'cake', name: 'Pastry', price: 9 , img: 'CAKE.png',} 
]

const currency_tags = [
    { id: 'bill-50', value: 50, className: 'money-tag-50' },
    { id: 'bill-20', value: 20, className: 'money-tag-20' },
    { id: 'bill-5', value: 5, className: 'money-tag-5' },
    { id: 'coin-2', value: 2, className: 'money-tag-2' },
    { id: 'coin-1', value: 1, className: 'money-tag-1' },
]

export default function SupermarketGame() {
    const [trolley, setTrolley] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [cashReceived, setCashReceived] = useState(0);
    const [isPayingPhase, setIsPayingPhase] = useState(false);
    const [terminalText, setTerminalText] = useState('Welcome! Drag items to the counter to scan them.');
    const onDragStart = (event, itemId, itemType) => {
        event.dataTransfer.setData('itemId', itemId);
        event.dataTransfer.setData('itemType', itemType);
    };

    const onScanDrop = (event) => {
        event.preventDefault();
        if (isPayingPhase) return;

        const id = event.dataTransfer.getData('itemId');
        const type = event.dataTransfer.getData('itemType')

        if (type === 'food') {
            const match = product_list.find((p) => p.id === id);
            if (match) {
                setTrolley((current) => [...current, match]);
                setTotalCost((currentTotal) => currentTotal + match.price);
                setTerminalText(`Scanned: ${match.name} -> +$${match.price}`);
            }
        }
    };

    const onDrawerDrop = (event) => {
        event.preventDefault();
        if(!isPayingPhase) return;

        const id = event.dataTransfer.getData('itemId');
        const type = event.dataTransfer.getData('itemType');

        if (type === 'money') {
            const match = currency_tags.find((m) => m.id === id);
            if (match) {
                setCashReceived((currentPaid) => currentPaid + match.value);
            }
        }
    };

    const balanceRemaining = totalCost - cashReceived;
    const restartRegister = () => {
        setTrolley([]);
        setTotalCost(0);
        setCashReceived(0);
        setIsPayingPhase(false);
        setTerminalText('Welcome! Drag items to the counter to scan the item');
    };

    return (
        <div className="supermarket">
            <header className="mainheader">
                <h1>🛒 SUPERMARKET</h1>
            </header>

            <main className="foodsection">
                <section className="aisle-grid">
                    {product_list.map((product) => (
                    <div
                      key={product.id}
                      className="productcard"
                      draggable={!isPayingPhase}
                      onDragStart={(e) => onDragStart(e, product.id, 'food')}
                    >
                      <img src={product.img} alt={product.name} className="productthumb" draggable={false} />
                      <p className="product-title">{product.name}</p>
                      <span className="productpricetag">${product.price}</span>
                    </div>
                  ))}
                </section>

                <section className="controlsidebar">
                    <div className="posterminal">
                        <h3>📟 MONITOR SCREEN</h3>

                        <div className="digitaldisplay">
                          {!isPayingPhase ? (
                            <>
                              {terminalText}
                              {`n\n\Items in Basket: ${trolley.length}\nTotal Bill: $${totalCost}`}
                            </>
                          ) : balanceRemaining > 0 ? (
                            `=== OUTSTANDING BALANCE ===\nTotal Due: $${totalCost}\nDeposited: $${cashReceived}\nRemaining: $${balanceRemaining}\n\n👉 Drag cash items into the register drawer below!`
                          ) : (  
                            ` WhoHoo!🎉\nTotal Cost: $${totalCost}\nTotal Paid: $${cashReceived}\nChange: $${Math.abs(balanceRemaining)}\n\nThank you for shopping!`
                          )}
                        </div>

                        {!isPayingPhase ? (
                            <div
                                className="counterscanner"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={onScanDrop}
                            >
                                <img src="COUNTER.png" alt="Register" className="countergraphics" />
                                <img src="laserbeam.png" alt="Laser scanner gun" className="scannergun" />
                                <div className="laserbeamline"></div>
                            </div>
                        ) : (
                            <div 
                            className="counterscanner"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={onDrawerDrop}
                            >
                              <img src="COUNTER_OPEN.png" alt="Open Register" className="countergraphics" />
                              <button className="paytriggertag" style={{backgroundColor: '#e67e22', marginTop: '10px'}} onClick={() => setIsPayingPhase(false)}>
                        ← back
                    </button>
                  </div>
                )}
            </div>

            <div className="lowercounter">
                <div className="trolleycartzone">
                    <header className="cartheader">
                      <h3>🧺 Current Trolley</h3>
                      {!isPayingPhase && trolley.length > 0 && (
                        <button className="paytriggertag" onClick={() => setIsPayingPhase(true)}>
                            Bill Tag →
                        </button>
                      )}
                    </header>
                    <div className="trolleygrid">
                      {trolley.map((item, index) => (
                        <div key={index} className="griditem">
                          <img src={item.img} alt="basket item copy" />
                        </div>
                      ))}
                    </div>
                    <img src="TROLLEY.PNG" alt="Cart Base Indicator" className="trolleywatermark" />
                </div>

                {isPayingPhase && (
                    <div className="registerdrawer">
                      <div className="moneytagwallet">
                        {currency_tags.map((tag) => (
                           <div
                             key={tag.id}
                             className={`moneytagelement ${tag.className}`}
                             draggable={balanceRemaining > 0}
                             onDragStart={(e) => onDragStart(e, tag.id, 'money')}
                            />
                        ))}
                      </div>

                      <div
                        className={`drawertraytarget ${balanceRemaining <= 0 ? 'is-close' : 'is-open'}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrawerDrop}
                       >
                        <div className="tray-inner-label">
                            <p>{balanceRemaining > 0 ? "📥 DROP MONEY TAGS HERE" : "DRAWER LOCKE"}</p>
                       </div>
                    </div>
                </div>
                )}
              </div>

              <button className="utility-button destructive-reset" onClick={restartRegister}>
                Reset Store System
              </button>
            </section>
           </main>
        </div>
    )
}