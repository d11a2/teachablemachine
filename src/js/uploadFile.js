// the link to your model provided by Teachable Machine export panel

const URL = "tm-my-image-model/";

let model, labelContainer, maxPredictions;

const barHolder = '<div class="bar-graph-holder"><div class="bar-graph-holder__label"></div><div class="bar-graph-holder__bar"><div class="inner"><span class="value-label"></span></div></div></div>';

// Load the image model

async function init() {
    console.log('init')

    $('#label-container').empty();

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    console.log(modelURL);
    console.log(metadataURL);

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = $('#label-container');

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.append(barHolder);
    }
}

function sortItems(prediction) {
    prediction.sort((a, b) => {
        return b.probability - a.probability;
    })
}

function displayItems(prediction, barHolders, count) {
    for (let i = 0; i < count; i++) {
        if (parseInt(prediction[i].probability.toFixed(2) * 100) > 0) {
            $(barHolders[i]).addClass("bar-graph-holder--visible")
        }
    }
}

async function predict() {
    console.log('predict')
    // predict can take in an image, video or canvas html element
    const image = document.getElementById('previewImage');
    const prediction = await model.predict(image, false);
    const barHolders = $('.bar-graph-holder');
    sortItems(prediction);

    for (let i = 0; i < maxPredictions; i++) {

        const percents = parseInt(prediction[i].probability.toFixed(2) * 100);
        const rgba = `${Math.floor(Math.random() * 255)},
                      ${Math.floor(Math.random() * 255)},
                      ${Math.floor(Math.random() * 255)}`;

        $(barHolders[i]).find('.bar-graph-holder__label').text(prediction[i].className);
        $(barHolders[i]).find('.value-label').text(percents + '%');
        $(barHolders[i]).find('.inner').css({
            width: `${percents}%`
        });
        $(barHolders[i]).find('.bar-graph-holder__bar').css({
            backgroundColor: `rgba(${rgba},0.2)`
        });
        $(barHolders[i]).find('.inner').css({
            backgroundColor: `rgba(${rgba},0.7)`
        });
        if (percents < 10) {
            $(barHolders[i]).find('.value-label').css({
                right: "-25px"
            })
        }
    }
    displayItems(prediction, barHolders, 5);
    $('.output').slideDown();
}

