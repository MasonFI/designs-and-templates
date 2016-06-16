// This extra wrapper around i18n.js is to make sure string to string match
// would return the passed string if the its translated counter part is not
// yet defined. This stops undefined stuff showing up. Making the development
// process easier, i.e., doing translation later.
define(['i18n!nls/ui'], function(uiStrings) {
  return function(identifier, transform) {
    if (typeof uiStrings[identifier] === "string" && uiStrings[identifier]) {
      if (typeof transform === "string") {
        switch(transform) {
          case "capitalize":
            return uiStrings[identifier].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
          case "capitalizefirst":
            return uiStrings[identifier].charAt(0).toUpperCase() + uiStrings[identifier].slice(1);
          case "uppercase":
            return uiStrings[identifier].toUpperCase();
          case "lowercase":
            return uiStrings[identifier].toLowerCase();
          default:
            break;
        }
      }

      return uiStrings[identifier];
    }

    return identifier;
  }
})
