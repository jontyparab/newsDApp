pragma solidity ^0.5.0;

contract News {
  string public name = "News Contract";

  uint public newsCount = 0;

  mapping(uint => newsArticle) public news;
  mapping(address => uint[]) public myBookMarks;

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

  event bookMarkAdded(
    uint id
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

  function getBookMarks() public view returns (uint[] memory) {
    uint[] memory _myBookMarksList = new uint[](myBookMarks[msg.sender].length);
    for(uint j = 0; j < myBookMarks[msg.sender].length; j++) {
      _myBookMarksList[j] = myBookMarks[msg.sender][j];
    }
    return _myBookMarksList;
  }

  function addBookMarks(uint _id) public {
    myBookMarks[msg.sender].push(_id);   
    emit bookMarkAdded(_id);

  }
}
