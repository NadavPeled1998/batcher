//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId)
        external
        view
        returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );
}

contract MultiSend {
    function multiSendNative(
        address payable[] memory _receivers,
        uint256[] memory _amounts
    ) public payable {
        for (uint256 i = 0; i < _receivers.length; i++) {
            _receivers[i].transfer(_amounts[i]);
        }
        payable(msg.sender).transfer(address(this).balance);
    }

    function multiSendERC20(
        address payable[] memory _receivers,
        uint256[] memory _amounts,
        address[] memory _tokens
    ) public {
        for (uint256 i = 0; i < _receivers.length; i++) {
            IERC20(_tokens[i]).transferFrom(
                msg.sender,
                _receivers[i],
                _amounts[i]
            );
        }
    }

    function multiSendERC721(
        address payable[] memory _receivers,
        uint256[] memory _tokenIds,
        address[] memory _tokens
    ) public {
        for (uint256 i = 0; i < _receivers.length; i++) {
            IERC721(_tokens[i]).transferFrom(
                msg.sender,
                _receivers[i],
                _tokenIds[i]
            );
        }
    }

    function multiSendNativeAndERC20(
        address payable[] memory _receivers,
        uint256[] memory _amounts,
        address[] memory _tokens
    ) public payable {
        for (uint256 i = 0; i < _receivers.length; i++) {
            if (_tokens[i] == address(0)) {
                _receivers[i].transfer(_amounts[i]);
            } else {
                IERC20(_tokens[i]).transferFrom(
                    msg.sender,
                    _receivers[i],
                    _amounts[i]
                );
            }
        }
        payable(msg.sender).transfer(address(this).balance);
    }

    function multiSendNativeAndERC721(
        address payable[] memory _receivers,
        uint256[] memory _amounts,
        address[] memory _tokens
    ) public payable {
        for (uint256 i = 0; i < _receivers.length; i++) {
            if (_tokens[i] == address(0)) {
                _receivers[i].transfer(_amounts[i]);
            } else {
                IERC721(_tokens[i]).transferFrom(
                    msg.sender,
                    _receivers[i],
                    _amounts[i]
                );
            }
        }
        payable(msg.sender).transfer(address(this).balance);
    }

    function multiSendAll(
        address payable[] memory _receivers,
        uint256[] memory _amounts,
        address[] memory _tokens,
        uint256[] memory _types
    ) public payable {
        for (uint256 i = 0; i < _receivers.length; i++) {
            if (_types[i] == 1) {
                _receivers[i].transfer(_amounts[i]);
            } else if (_types[i] == 2) {
                IERC20(_tokens[i]).transferFrom(
                    msg.sender,
                    _receivers[i],
                    _amounts[i]
                );
            } else if (_types[i] == 3) {
                IERC721(_tokens[i]).transferFrom(
                    msg.sender,
                    _receivers[i],
                    _amounts[i]
                );
            }
        }
        payable(msg.sender).transfer(address(this).balance);
    }
}
