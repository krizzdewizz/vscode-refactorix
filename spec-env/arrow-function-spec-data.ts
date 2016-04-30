function singleStatementBlockToExpression() {

    function nok() {

        () => {
            return 0;
        };

        () => {
            return 0 ? 1 : 0;
        };

        function q() {
            () => {
                0;
            };
        }
    }

    function ok() {
        () => 0;

        () => {
            if (0) {
                // doit
            }
        };

        () => {
            while (0) {
                ;
            }
        };

        () => {
            for (; ;) {
                ;
            }
        };

        () => {
            do {
                ;
            } while (0);
        };
    }
}