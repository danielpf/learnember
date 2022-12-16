import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { dasherize } from '@ember/string';
import Band from 'rarwe/models/band';

export default class BandsNewController extends Controller {
  @tracked name;
  @service catalog;
  @service router;

  get hasNoName() {
    return !this.name;
  }

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  async saveBand(event) {
    const band = this.catalog.create('bands', { name: this.name });
    this.catalog.add('band', band);
    this.name = '';
    this.router.transitionTo('bands.band.songs', id);
  }

  resetController(controller) {
    controller.name = '';
  }
}
