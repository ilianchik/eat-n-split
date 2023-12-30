import { useState } from "react";

export default function App() {
  const [friends, setFriends] = useState([
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(false);
  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    !selectedFriend || selectedFriend.id !== friend.id
      ? setSelectedFriend(friend)
      : setSelectedFriend(false);
    setShowAddFriend(false);
  }
  function handleSlpitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend ? <FormAddFriend onAddFriend={handleAddFriend} /> : null}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSlpitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;

  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          key={friend.id}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  return (
    <li className={selectedFriend.id === friend.id ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        style={
          friend.balance < 0
            ? { color: "red" }
            : friend.balance > 0
            ? { color: "green" }
            : null
        }
      >
        {friend.balance < 0
          ? `You owe ${friend.name} ${Math.abs(friend.balance)}€`
          : friend.balance > 0
          ? `${friend.name} owes you ${friend.balance}€`
          : `You and ${friend.name} are even`}
      </p>
      <Button onClick={() => onSelection(friend)}>
        {selectedFriend.id === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48?");
  const id = crypto.randomUUID();
  const friend = { id, name, image: `${img}${id}`, balance: 0 };

  return (
    <form
      className="form-add-friend"
      onSubmit={(e) => {
        e.preventDefault();
        onAddFriend(friend);
      }}
    >
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♂️Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill
              ? paidByFriend
              : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑Who is playing the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
