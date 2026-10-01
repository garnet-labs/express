import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"

const { dependencies = {} } = JSON.parse(readFileSync("package.json", "utf8"))
let failed = 0
for (const name of Object.keys(dependencies)) {
  const code = `import(${JSON.stringify(name)}).then(() => process.exit(0), (error) => { console.error(error.message); process.exit(1) })`
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", code], { stdio: "inherit", timeout: 30000 })
  const ok = result.status === 0
  if (!ok) failed += 1
  console.log(`${ok ? "ok" : "FAIL"} ${name}`)
}
process.exit(failed === 0 ? 0 : 1)
