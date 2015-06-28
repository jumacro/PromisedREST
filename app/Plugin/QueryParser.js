module.exports = {

    /*
     * THIS MODULE IS COMPATIBLE WITH MONGOOSE 4.0+
     * @version: 0.1
     *
     * Changed field.operator -> field:operator
     *
     * Supports:
     * - All MongoDB comparison operators
     * - Logical AND
     *
     * Not supports:
     * - Logical OR, NOR, NOT
     *
     * Example:
     * 	_q=genre,filling_rate,retail_price&_a=g,f,p&g:eq=ROC&f:gt=75&p:gt=6&p:lte=7.95
     */

    /*
     * Create an associative array of fieldnames.
     *
     * this maps the aliases -> fieldnames (if aliases exist)
     *
     * @param map field name mapping REST -> collection
     * @param q array of field names
     * @param a array of aliases (optional)
     * @return associative array of aliases -> fieldnames
     */
    map: function (q, a) {
        var fieldnames = [];
        var qfields = q.split(',');
        if (a != null) {
            var aliases = a.split(',');
            // associate aliases with fieldnames
            for (var i = 0; i != aliases.length && i != qfields.length; i++) {
                fieldnames[aliases[i]] = qfields[i];
            }
            // remaining query parameters use fieldnames
            for (var j = i; j != qfields.length; j++) {
                fieldnames[qfields[j]] = qfields[j];
            }
        } else { // no aliases are used, only fieldnames
            for (var i = 0; i != qfields.length; i++) {
                fieldnames[qfields[i]] = qfields[i];
            }
        }
        return fieldnames;
    },


    /*
     * Parse the query string.
     *
     * parameters that contain ':' are name:operator
     * e.g. price:eq -> field = price, operator = eq
     *
     * @param pQuery the original query string
     * @param fieldNames associative array of aliases -> fieldnames
     * @return associative array of query components fieldname -> query components
     */
    parse: function (pQuery, fieldNames) {
        var qNames = Object.keys(pQuery).sort();
        var qPar = [];
        for (var ix = 0; ix != qNames.length; ix++) {
            var q = qNames[ix];
            var i = q.indexOf(':');
            if (i > -1) {
                var fn = fieldNames[q.substring(0, i)];
                if (qPar[fn] == null)
                    qPar[fn] = [];

                // i+1 could be out of range
                var op = '$'.concat(q.substring(i + 1));
                var value = (op == '$in') ? pQuery[q].split(',') : pQuery[q];

                var node = {};
                node[op] = value;
                qPar[fn].push(node);
            }
        }
        return qPar;
    },


    /*
     * Build the query.
     *
     * @param associative array of query components fieldname -> query components
     * @return JSON query object
     */
    build: function (qPar) {
        var query = {};
        query.$and = [];
        var qNames = Object.keys(qPar);

        for (var ii = 0; ii != qNames.length; ii++) {
            var key = qNames[ii];
            var comp = qPar[key];
            for (var jj = 0; jj != comp.length; jj++) {
                var part = {};
                part[key] = comp[jj];
                query.$and.push(part);
            }
        }
        return query;
    }
};
