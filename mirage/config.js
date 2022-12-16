import mirage from 'ember-cli-mirage';

export default function () {
  this.get('/bands');
  this.post('/bands');
  this.get('/bands/:id');
  this.get('/bands/:id/songs', function (schema, request) {
    const band = schema.bands.find(request.params.id);
    return band.songs;
  });

  this.post('/songs');
  this.put('/songs/:id');
  this.patch('/songs/:id');
  this.del('/songs/:id');
}
