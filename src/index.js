const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);
    
    const { owner, repo } = github.context.repo;
    const prNumber = github.context.payload.pull_request.number;
    
    console.log(`Processing PR #${prNumber} in ${owner}/${repo}`);
    
    // Get PR details
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber
    });
    
    const additions = pr.additions;
    const deletions = pr.deletions;
    const size = additions + deletions;
    
    console.log(`PR size: ${additions} additions + ${deletions} deletions = ${size} total changes`);
    
    // Determine size label
    let sizeLabel = 'XS';
    if (size > 600) {
      sizeLabel = 'XXL';
    } else if (size > 240) {
      sizeLabel = 'XL';
    } else if (size > 120) {
      sizeLabel = 'L';
    } else if (size > 60) {
      sizeLabel = 'M';
    } else if (size > 35) {
      sizeLabel = 'S';
    }
    
    console.log(`Determined size label: ${sizeLabel}`);
    
    // Get current labels
    const { data: currentLabels } = await octokit.rest.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number: prNumber
    });
    
    // Remove existing size labels
    const sizeLabels = currentLabels.filter(label => label.name.startsWith('size:'));
    console.log(`Found ${sizeLabels.length} existing size labels to remove`);
    
    for (const label of sizeLabels) {
      console.log(`Removing label: ${label.name}`);
      await octokit.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: prNumber,
        name: label.name
      });
    }
    
    // Add new size label
    const newLabel = `size: ${sizeLabel}`;
    console.log(`Adding label: ${newLabel}`);
    
    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: prNumber,
      labels: [newLabel]
    });
    
    console.log(`Successfully labeled PR #${prNumber} with ${newLabel}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
