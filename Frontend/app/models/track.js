import DS from 'ember-data';

export default DS.Model.extend({

    Track_Bytes: DS.attr(),
    Track_Composer: DS.attr(),
    Track_GenreId: DS.attr(),
    Track_MediaTypeId: DS.attr(),
    Track_Name: DS.attr(),
    Track_Price: DS.attr(),
    Track_Album: DS.belongsTo('album'),
    Track_AlbumId: DS.attr(),
    Track_Milliseconds: DS.attr(),
    Track_TrackId: DS.attr(),
    Track_UnitPrice: DS.attr(),
    Album_AlbumId: DS.attr(),
    Album_ArtistId: DS.attr(),
    Album_Title: DS.attr(),
    Artist_ArtistId: DS.attr(),
    Artist_Name: DS.attr(),
    Genre_Name: DS.attr(),

});
