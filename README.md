*Project is work in progress.*

Command Line Interface ([CLI](https://en.wikipedia.org/wiki/Command-line_interface)) Tool for using the [Kontist](https://kontist.com/) API which under the hood relies on their marvelous [GraphQL API](https://kontist.dev/docs/#schema-reference) [Kontist Javascript SDK](https://kontist.dev/sdk/#using-the-sdk)

# Ideas 

- [x] balance (`kontist-cli balance`, returns `availableBalance`)
    - [x] get current balance
    - [ ] different output when availableBalance doesn’t match balance
    - [ ] add notification when card fraud is on
- [x] option to permanently set different LC_ALL
- [x] status command returns current overall status (`kontist-cli account`)
- [ ] validate IBAN (checksum)
- [ ] prevent invalid characters in purpose, e2eid
- [ ] add multiple output formats
    - [ ] `--pretty` as table
    - [ ] `--json` as json (default)
    - [ ] `--plain` as tsv (easy for additional processing with `xargs`)
- [ ] multi-account
    - [ ] add account (name defaults to "default")
        ```
        kontist-cli account login <client-id> <username>
        ```
    - [ ] add account with named alias
        ```
        kontist-cli account login --name myAlias <client-id> <username>
        ```
    - [ ] list accounts
        ```
        kontist-cli accounts list

        | name     | clientId | username |
        |----------|----------|----------|
        | default  |          |          |
        ```
    - [ ] remove account with alias
        ```
        kontist-cli account delete <id>
        ```
    - [ ] remove all accounts
        ```
        kontist-cli account delete all
        ```
    - [ ] use specific account
    
        Example with transfer for the account with the name "accountName":
    
        ```
        kontist-cli transfer create --account accountName <iban> <recipient> <amount>
        ```
- [ ] cards
    - [x] list `kontist-cli cards list`
        - [ ] including card settings
        - [ ] including card limits
    - [x] get specific card `kontist-cli cards <id>`
    - [x] block `kontist-cli cards block <id>` (`changeCardStatus`)
    - [x] unblock `kontist-cli cards unblock <id>` (`changeCardStatus`)
    - [ ] replace `kontist-cli cards replace <id>` (`replaceCard`)
    - [ ] reorder `kontist-cli cards reorder <id>` (`reorderCard`)
    - [ ] update card settings / limits
- [ ] invoice
    - [ ] list
    - [ ] update invoice
        - [ ] add product
        - [ ] remove product
    - [ ] create invoice
    - [ ] delete invoice
- [x] money format?
- [x] currency?
- [ ] transfers
    - [ ] make it easier to repeat transactions
        - [ ] proposal: re-use transactions by id
        - [ ] proposal: auto-completion for `kontist-cli transfer` arguments
        - [ ] proposal: address-book like presets?
    - [x] list
    - [ ] cancel (mutation `cancelTransfer` & `confirmCancelTransfer`)
        ```
        kontist-cli transfer cancel <id>
        ```
    - [ ] create
        - [ ] enable IBAN with spacing
        - [ ] convert umlauts to eu, ß to ss
        - [x] normal order
            ```
            kontist-cli transfer create <iban> <recipient> <amount> --executeAt <executionDate>
            ```
        - [x] confirmation mfa
        - [x] timed order
            ```
            kontist-cli transfer create <iban> <recipient> <amount> \
                --executeAt <executionDate>
            ```
        - [ ] standing order with additional [StandingOrderReoccurenceType](https://kontist.dev/docs/#standingorderreoccurrencetype)
            ```
            kontist-cli transfer create <iban> <recipient> <amount> \
                --executeAt <executionDate>` \
                --lastExecutionTime <optionalDate> \
                --reoccurence <reoccurenceType>;
            ```
    - [ ] update
        - [ ] [update standing order](https://kontist.dev/sdk/#updating-a-standing-order)
        - [ ] [categorize transaction](https://kontist.dev/sdk/#categorize-a-transaction) ([TransactionCategory](https://kontist.dev/docs/#transactioncategory))
- [ ] transactions
    - [x] list
        - [x] limit transactions
        - [x] search transactions
        - [ ] paginate transactions
        - [ ] filter transactions
            - [x] by iban(s)
            - [x] short filter for incoming / outgoing
                ```
                kontist-cli transactions list --outgoing
                kontist-cli transactions list --incoming
                ```
            - [x] by date-range 
                ```
                kontist-cli transactions list --from 2021-01-01 --to 2021-02-32
                ```
            - [ ] by date-range names
                ```
                kontist-cli transactions list this-month;
                kontist-cli transactions list last-month;
                kontist-cli transactions list this-year;
                kontist-cli transactions list today;
                kontist-cli transactions list yesterday;
                ```
    - [x] listen for new transactions (https://kontist.dev/sdk/#subscribe-to-new-transactions)
- [ ] cli auto-completion
- [ ] cli tui interface
    - [ ] list transactions
    - [ ] show details of transaction
    - [ ] new transaction
- [ ] maintenance tasks
    - [ ] publish on NPM
    - [x] use version from package.json
    - [ ] setup semantic release
    - [ ] setup discussions

# Setup

- Valid client id for authentication. Request your client id in the API Client Management on https://kontist.dev/client-management/.
- Create Access- & Refresh Token (valid for 1year) and store in system user preferences:
    ```
    kontist-cli login <oauth-client-id> <username>
    ```
    you’ll be promted for the password

# Examples

The command-line-tool does not include any table formater or filtering mechanism as there are other nice tools for that like [table-printer-cli](https://www.npmjs.com/package/table-printer-cli) for formatting JSON output to a nice-looking table and [jq](https://stedolan.github.io/jq/) for transforming and filtering JSON.

Both tools in combination can be used to create a nice-looking, customizable list of transactions:

    kontist-cli transactions | jq -c 'map({bookingDate,valutaDate,amount,name,iban})' | npx table-printer-cli -s

Some other command rely on the systems `LC_ALL`, `LC_TIME`, or `LC_NUMERIC` variables to format monetary values or provide additional formatted dates. The `balance` sub-command:

    $ LC_ALL=de-de kontist-cli balance
    50,20 €

# Other Projects / Bookmarks

- [Netnexus/IKontist](https://github.com/netnexus/IKontist)
- [N26 CLI (Python)](https://github.com/femueller/python-n26)
- [Teller CLI](https://github.com/sebinsua/teller-cli)
- [mbank cli](https://github.com/jwilk/mbank-cli)

- [Kontist GraphQL Schema Reference](https://kontist.dev/docs/#updatetransferinput)
- [Kontist DEV](https://kontist.dev)
- [Kontist GraphQL Playground](https://kontist.dev/playground/)
