    require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer"
    ], function(Map, MapView, FeatureLayer) {
      var map = new Map({
        basemap: "streets-night-vector"
      });
      var lyr = new FeatureLayer({
        url: "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1",
        outFields: ["*"],
        popupTemplate: {
          title: "Coranavirus Data",
          content: "Confirmed: {Confirmed}<br>Deaths: {Deaths}<br> Recovered: {Recovered}"
        }
      });
      map.add(lyr);
      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-20, 35],
        zoom: 2
      });
    });