

interface Node {
    "MM:dd hh:mm:ss"?: string;
    "mwmkey": number | string;
    "image sources"?: string;
    "LEAF"?: string;
    "txtdesc"?: string;
    "imgurl"?: string;
    "mwmtype"?: string;
    "BRANCH"?: string;
    "items"?: Node[];
  }
  
  
  function traverse(node: Node, level: number = 0): void {
    const indent = ' '.repeat(level * 2);
    console.log(`${indent}Node:\n ${JSON.stringify(node)}`);
    
    if (node.items) {
      node.items.forEach(child => traverse(child, level + 1));
    }
  }
  const json: Node[] = [
    {
        "LEAF": "American_Gothic",
        "txtdesc": "",
        "imgurl": "/jpeg/American_Gothic88Wikimedia.jpg",
        "mwmkey": "American_Gothic",
        "mwmtype": "image",
        childNodes: []
    },
    {
        "LEAF": "wwwqqqq",
        childNodes: []
    }
  ];
  console.log('cc starting')
  json.forEach(node => traverse(node));

  
  