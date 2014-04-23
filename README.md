This dashboard is a Kanban visualisation of Bugzilla bugs. It takes all the direct blockers (first level) of a bug (called master bug) and displays in a Kanban fashion.

# How to use
## Columns
Three columns are automatically created:

* Done: all RESOLVED VERIFIED bugs
* QA: all other RESOLVED bugs
* Backlog: All opened bugs without a valid column tag

To create other columns, add a tag in the first comment of the master bug in the form `kanban-n-label`. `n` is the position of the column, `label` is the name of that column.

## Bugs
To put a bug in a column, add a tag to the first comment of that bug in the form `kanban-label`.

To mark a bug as blocked, just add a `blocked`

# Future
This is a read-only tool for now. Once we tweak the logic to fit our needs, we will add some write capabilities.
Feel free to open issues for features you'd like to see.
