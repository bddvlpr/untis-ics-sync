import { Injectable, Logger } from '@nestjs/common';
import { WebUntis } from 'webuntis';

@Injectable()
export class UntisService {
  private readonly logger = new Logger(UntisService.name);

  client: WebUntis;

  constructor() {
    this.client = new WebUntis();
    // TODO: Environment loading
  }

  async validateSession() {
    if (!(await this.client.validateSession())) {
      this.logger.debug('Session is invalid. Renewing now...');
      await this.client.login();
    }
  }

  async fetchLatestSchoolyear() {
    await this.validateSession();

    return this.client.getLatestSchoolyear();
  }

  async fetchClasses(schoolyearId?: number) {
    await this.validateSession();

    if (!schoolyearId) schoolyearId = (await this.fetchLatestSchoolyear()).id;
    this.logger.log(`Fetching classes for schoolyear  ${schoolyearId}...`);
    return this.client.getClasses(false, schoolyearId);
  }
}
