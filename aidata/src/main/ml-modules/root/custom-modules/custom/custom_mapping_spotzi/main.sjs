/*
  Copyright 2012-2019 MarkLogic Corporation

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const DataHub = require("/data-hub/5/datahub.sjs");
const datahub = new DataHub();

function formatDate(date) {
  //Transform incoming date to MarkLogic acceptable date
  if (xdmp.castableAs("http://www.w3.org/2001/XMLSchema","date",$date)) {
    return xs.dateTime($date)
  } else {
    return xdmp.parseDateTime("[Y01]-[M01]-[D01]", $date)
  }
}

function main(content, options) {

  //grab the doc id/uri
  let id = content.uri;

  //here we can grab and manipulate the context metadata attached to the document
  let context = content.context;

  //let's set our output format, so we know what we're exporting
  let outputFormat = options.outputFormat ? options.outputFormat.toLowerCase() : datahub.flow.consts.DEFAULT_FORMAT;

  //here we check to make sure we're not trying to push out a binary or text document, just xml or json
  if (outputFormat !== datahub.flow.consts.JSON && outputFormat !== datahub.flow.consts.XML) {
    datahub.debug.log({
      message: 'The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.',
      type: 'error'
    });
    throw Error('The output format of type ' + outputFormat + ' is invalid. Valid options are ' + datahub.flow.consts.XML + ' or ' + datahub.flow.consts.JSON + '.');
  }

  //Here we check to make sure it's still there before operating on it
  if (!fn.docAvailable(id)) {
    datahub.debug.log({message: 'The document with the uri: ' + id + ' could not be found.', type: 'error'});
    throw Error('The document with the uri: ' + id + ' could not be found.')
  }

  //grab the 'doc' from the content value space
  let doc = content.value;

  // let's just grab the root of the document if its a Document and not a type of Node (ObjectNode or XMLNode)
  if (doc && (doc instanceof Document || doc instanceof XMLDocument)) {
    doc = fn.head(doc.root);
  }

  //get our instance, default shape of envelope is envelope/instance, else it'll return an empty object/array
  let instance = datahub.flow.flowUtils.getInstance(doc) || {};

  // get triples, return null if empty or cannot be found
  let triples = datahub.flow.flowUtils.getTriples(doc) || [];

  //gets headers, return null if cannot be found
  let headers = datahub.flow.flowUtils.getHeaders(doc) || {};

  //If you want to set attachments, uncomment here
  // instance['$attachments'] = doc;

  //insert code to manipulate the instance, triples, headers, uri, context metadata, etc.
  if (fn.empty(source.xpath('//cartodb_id'))) {
    let id = fn.head(source.xpath('//cartodb_id'));
  } else {
    let id = null;
  }

  let postalcode = !fn.empty(source.xpath('//postalcode')) ? fn.head(source.xpath('//postalcode')) : null;
  let streetnr = !fn.empty(source.xpath('//housenr')) ? fn.head(source.xpath('//housenr')) : null;
  let streetnr_ext = !fn.empty(source.xpath('//housenrext')) ? fn.head(source.xpath('//housenrext')) : null;
  let city = !fn.empty(source.xpath('//city')) ? fn.head(source.xpath('//city')) : null;
  let price = !fn.empty(source.xpath('//price')) ? fn.head(source.xpath('//price')) : null;
  let rooms = !fn.empty(source.xpath('//rooms')) ? fn.head(source.xpath('//rooms')) : null;
  let square_footage_object = !fn.empty(source.xpath('//area')) ? fn.head(source.xpath('//area')) : null;
  let square_footage_lot = !fn.empty(source.xpath('//lotsize')) ? fn.head(source.xpath('//lotsize')) : null;
  let date_listed = !fn.empty(source.xpath('//listedsince')) ? formatDate(fn.head(source.xpath('//listedsince'))) : null;
  let date_sold = !fn.empty(source.xpath('//dateofsale')) ? formatDate(fn.head(source.xpath('//dateofsale'))) : null;
  let broker = !fn.empty(source.xpath('//broker')) ? fn.head(source.xpath('//broker')) : null;
  
  // Determine price range
  switch(true) {
    case $price < 100000:
        $price_range = "0-100000";
      break;
      case $price < 150000:
        $price_range = "100000-150000";
      break;
      case $price < 200000:
        $price_range = "150000-200000";
      break;
      case $price < 300000:
        $price_range = "200000-300000";
      break;
      default:
        $price_range = "300000+";
  }

  // Determine time that the object has been for sale
let oneDay = 24*60*60*1000;
let firstDate = new date($date_sold);
let secondDate = new date($date_listed);
let time_for_sale_days = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

  switch(true) {
    case $time_for_sale_days < 10:
        time_for_sale = "0-10";
      break;
      case $time_for_sale_days < 30:
        time_for_sale = "10-30";
      break;
      case $time_for_sale_days < 60:
        time_for_sale = "30-60";
      break;
      case $time_for_sale_days < 120:
        time_for_sale = "60-120";
      break;
      default:
        time_for_sale = "120+";
  }
  
  //form our envelope here now, specifying our output format
  let envelope = datahub.flow.flowUtils.makeEnvelope(instance, headers, triples, outputFormat);

  //assign our envelope value
  content.value = envelope;

  //assign the uri we want, in this case the same
  content.uri = id;

  //assign the context we want
  content.context = context;

  //now let's return out our content to be written
  return content;
}

module.exports = {
  main: main
};
