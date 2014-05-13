app.service('restrictionService', function() {
  //abstracted comparator
      //basic methods
      // is (direct), in (indexOf), like (wildcards/regex)
      //such that
      //RestrictionService.setUser(user);
      // Now a restriction set looks like {restrictions: [["northwestern.edu", "in email"], ["location in", "Evanston, IL Richmond, IN"]]}
      //for r in restrictions: return RestrictionService.check(r[0], r[1])
      //or directly: RestrictionService.check("email like", /[A-z0-9]+@u.northwestern.edu/)
  //Storing Regex to firebase will be... hard? Maybe. As string, then new RegEx(str). Not hard.
  
  this._comparators = {
    'is'  : function(a, b) { return a === b; },
    'in'  : function(a, b) { return a.indexOf(b) > -1 },
    'like': function(a, b) { return b.test(a) }
  };
  
  this.user = {};
  
  this.setUser = function(u) {
    this.user = u;
  }
  
  this.check = function(rPt1, rPt2) {
    var cmd, userField, strArg, checkArg;
    //alternatively:
    // rPt1.substring(0,2) in this._comparators (won't work for like?)
    // this._comparators.hasOwnProperty(rPt1.split(" ")[0]) // defs will be slow...?
    // rPt1.split(" ")[0] in this._comparators //pretty much equivalent to the above
    // rPt1 contains field from user -
    // rPt1.indexOf('email') > -1 (in the case of an email restriction though)
    // rPt1.split(" ")[1] in this.user //pretty much equivalent to checker with comparators
    //Or... dynamic regex? for key in this._comparators: rxArr.push(key); new RegEx(rxArr.join('|'))
    //this is probably the best stopgap
    if(user.restrictions) user = user.restrictions;
    cmd = /in|is|like/.test(rPt1) ? (strArg = rPt1.split(" "), checkArg = rPt2, strArg  .pop()):
                                    (strArg = rPt2.split(" "), checkArg = rPt1, strArg.shift());
    userField = strArg.join();
    return this.user && this.user[userField] && this._comparators[cmd](this.user[userField], checkArg);
  }
});