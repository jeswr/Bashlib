import copy from '../../commands/solid-copy';
import authenticate from '../../authentication/authenticate';
import { addEnvOptions, changeUrlPrefixes } from '../../utils/shellutils';
import { writeErrorString } from '../../utils/util';
import { Command } from 'commander';
import SolidCommand from './SolidCommand';

export default class CopyCommand extends SolidCommand { 

  public addCommand(program: Command) {
    this.programopts = program.opts();

    program
      .command('cp')
      .description('Utility to copy files from and to both the local file system and remote Solid pod.')
      .argument('<src>', 'file or directory to be copied')
      .argument('<dst>', 'destination to copy file or directory to')
      .option('-a, --all', 'Copy .acl files in recursive directory copies')
      .option('-i, --interactive-override', 'Interactive confirmation prompt when overriding existing files')
      .option('-n, --no-override', 'Do not override existing files')
      .option('-v, --verbose', 'Log all read and write operations')
      .action(this.executeCommand)

    program
      .command('copy')
      .description('Utility to copy files from and to both the local file system and remote Solid pod.')
      .argument('<src>', 'file or directory to be copied')
      .argument('<dst>', 'destination to copy file or directory to')
      .option('-a, --all', 'Copy .acl files in recursive directory copies')
      .option('-i, --interactive-override', 'Interactive confirmation prompt when overriding existing files')
      .option('-n, --no-override', 'Do not override existing files')
      .option('-v, --verbose', 'Log all read and write operations')
      .action(this.executeCommand)
    
    return program
  }

  async executeCommand (src: string, dst: string, options: any) {
    let programOpts = addEnvOptions(this.programopts || {});
    const authenticationInfo = await authenticate(programOpts)
    let opts = { 
      fetch: authenticationInfo.fetch, 
    }
    try {
      src = await changeUrlPrefixes(authenticationInfo, src)
      dst = await changeUrlPrefixes(authenticationInfo, dst)
      await copy(src, dst, { ...options, ...opts})  
    } catch (e) {
      writeErrorString(`Could not copy requested resources from ${src} to ${dst}`, e)
      if (this.mayExit) process.exit(1)
    }
    if (this.mayExit) process.exit(0)
  }


}

