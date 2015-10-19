

export function testDecorator() {
  console.log('testDecorator', arguments);
  return function(/*Component*/) {
    console.log('testDecorator func', arguments);
  };
}
