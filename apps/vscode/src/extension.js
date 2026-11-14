import * as vscode from "vscode";
import { createProject, templates, validateProjectOptions } from "@forgekit/core";

export function activate(context) {
  const output = vscode.window.createOutputChannel("ForgeKit");
  context.subscriptions.push(output);
  context.subscriptions.push(
    vscode.commands.registerCommand("forgekit.listTemplates", async () => {
      const selected = await vscode.window.showQuickPick(
        [...templates.values()].map((item) => ({ label: item.title, description: item.description, detail: item.id })),
        { placeHolder: "Available ForgeKit templates" }
      );
      if (selected) vscode.window.showInformationMessage(`${selected.label}: ${selected.description}`);
    }),
    vscode.commands.registerCommand("forgekit.createProject", async () => {
      try {
        const name = await vscode.window.showInputBox({
          prompt: "Project name",
          placeHolder: "my-app",
          validateInput: (value) => /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,47}$/.test(value) ? undefined : "Use 1–48 letters, numbers, hyphens, or underscores."
        });
        if (!name) return;
        const template = await vscode.window.showQuickPick(
          [...templates.values()].map((item) => ({ label: item.title, description: item.description, id: item.id })),
          { placeHolder: "Choose a starter template" }
        );
        if (!template) return;
        const folders = await vscode.window.showOpenDialog({ canSelectFiles: false, canSelectFolders: true, canSelectMany: false, openLabel: "Choose parent folder" });
        if (!folders?.[0]) return;
        const config = validateProjectOptions({ name, template: template.id, path: folders[0].fsPath, database: "none", install: false });
        output.show(true);
        const result = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `Creating ${name}`, cancellable: false }, () => createProject(config));
        output.appendLine(`Created ${result.targetDir}`);
        const action = await vscode.window.showInformationMessage(`Created ${name}.`, "Open in VS Code", "Show in Explorer");
        if (action === "Open in VS Code") await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(result.targetDir), true);
        if (action === "Show in Explorer") await vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(result.targetDir));
      } catch (error) {
        output.appendLine(error.stack ?? error.message);
        vscode.window.showErrorMessage(`ForgeKit: ${error.message}`);
      }
    })
  );
}
export function deactivate() {}
