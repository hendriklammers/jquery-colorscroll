describe("jQuery colorScroll plugin", function() {
  var element;

  beforeEach(function() {
    element = $('<div/>');
  });

  it("should be defined on the jQuery object", function() {
    expect($.fn.colorScroll).toBeDefined();
  });

  it("should be chainable", function() {
    expect(element.colorScroll()).toBe(element);
  });
});