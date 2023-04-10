# CLI

```
EDAcation CLI

edacation <command>

Commands:
  edacation init <project>              Initialize EDA project
  edacation yosys <project> <target>    Synthesize with Yosys
  edacation nextpnr <project> <target>  Place and route with nextpnr

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

**Commands**
- [`edacation init`](#edacation-init)
- [`edacation yosys`](#edacation-yosys)
- [`edacation nextpnr`](#edacation-nextpnr)

## `edacation init`
### Help
```
edacation init <project>

Initialize EDA project

Positionals:
  project  EDA project file (e.g. "full-adder.edaproject")   [string] [required]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --name     Name of the project (e.g. "Full Adder")                    [string]
```

### Example
```
edacation init counter
```

## `edacation yosys`
### Help
```
edacation yosys <project> <target>

Synthesize with Yosys

Positionals:
  project  EDA project file (e.g. "full-adder.edaproject")   [string] [required]
  target   EDA target                                        [string] [required]

Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -x, --execute  Whether to execute the tool.          [boolean] [default: true]
```

### Example
```
edacation nextpnr counter ecp5
```

## `edacation nextpnr`
### Help
```
edacation nextpnr <project> <target>

Place and route with nextpnr

Positionals:
  project  EDA project file (e.g. "full-adder.edaproject")   [string] [required]
  target   EDA target                                        [string] [required]

Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -x, --execute  Whether to execute the tool.          [boolean] [default: true]
```

#### Example
```
edacation nextpnr counter ecp5
```
