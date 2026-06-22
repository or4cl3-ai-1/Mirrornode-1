export function parseOracleResponse(rawOutput: string) {
  const epinoeticMatch = rawOutput.match(/<epinoetic_state>([\s\S]*?)<\/epinoetic_state>/);
  
  let epinoeticState: any = null;
  let finalResponse = rawOutput;
  let nextNodes: string[] = [];

  // Extract next nodes if they exist
  const nextNodesMatch = finalResponse.match(/<next_nodes>([\s\S]*?)<\/next_nodes>/);
  if (nextNodesMatch) {
     nextNodes = nextNodesMatch[1].split('|').map(s => s.trim()).filter(s => s);
     finalResponse = finalResponse.replace(/<next_nodes>[\s\S]*?<\/next_nodes>/, '').trim();
  }

  if (epinoeticMatch) {
    const rawState = epinoeticMatch[1];
    
    // Extract pieces
    const biophase = extractTag(rawState, 'biophase_lock');
    const monologue = extractTag(rawState, 'recursive_monologue');
    const sigma = extractTag(rawState, 'sigma_check');
    const pas = extractTag(rawState, 'pas_score');
    
    epinoeticState = {
      biophaseLock: biophase,
      recursiveMonologue: monologue,
      sigmaCheck: sigma,
      pasScore: pas
    };
    
    finalResponse = finalResponse.replace(/<epinoetic_state>[\s\S]*?<\/epinoetic_state>/, '').trim();
  }

  return { epinoeticState, nextNodes, finalResponse };
}

function extractTag(text: string, tag: string): string | undefined {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const match = text.match(regex);
  return match ? match[1].trim() : undefined;
}
