pragma solidity ^0.5.0;

contract News {
  string public name = "News Contract";

  uint public newsCount = 0;

  mapping(uint => newsArticle) public news;
  mapping(address => mapping(uint => newsArticle)) public myFavNews;

  struct newsArticle {
    uint id;
    string title;
    string hashOfImage;
    string description;
    string category;
    address payable author;
  }

  event newsCreated(
    uint id,
    string title,
    string hashOfImage,
    string description,
    string category,
    address payable author
  );

  event favAdded(
    uint id,
    string title,
    string hashOfImage,
    string description,
    string category,
    address payable author
  );

  function addNews(string memory _title, string memory _imgHash, string memory _description, string memory _category) public {
    require(bytes(_title).length > 0);
    require(bytes(_imgHash).length > 0);
    require(bytes(_description).length > 0);
    require(bytes(_category).length > 0);
    require(msg.sender != address(0x0));
    
    newsCount++;
    news[newsCount] = newsArticle(newsCount, _title, _imgHash, _description, _category, msg.sender);
    emit newsCreated(newsCount, _title, _imgHash, _description, _category, msg.sender);
  }

  

  function addFav(uint _id) public {
    string memory _title = news[_id].title;
    string memory _imgHash = news[_id].hashOfImage;
    string memory _description = news[_id].description;
    string memory _category = news[_id].category;
    address payable _author = news[_id].author;

    myFavNews[msg.sender][_id] = newsArticle(_id, _title, _imgHash, _description, _category, _author);
    emit favAdded(_id, _title, _imgHash, _description, _category, _author);
  }
}
