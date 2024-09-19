//get ellements and add listeners to the buttons
let generateButton = document.getElementById('generateButton').addEventListener('click', getInputValue);
document.getElementById('answer1-btn').addEventListener('click', checkAnswer);
document.getElementById('answer2-btn').addEventListener('click', checkAnswer);
document.getElementById('answer3-btn').addEventListener('click', checkAnswer);
document.getElementById('answer4-btn').addEventListener('click', checkAnswer);
let answer = 0;

//ckeck for enter after puting in a topic 
let inputElement = document.getElementById('topicInput');
inputElement.addEventListener('keypress', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        getInputValue();
    }
})

async function getInputValue() {
    // Reset button colors
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById('answer' + i + '-btn');
        button.style.color = '#005C78';
    }

    // Get user input topic
    let inputTopic = inputElement.value.trim(); // Trim to remove extra whitespace
    if (!inputTopic) {
        alert('Please enter a topic before generating questions.');
        return;
    }

    // Construct messages array with dynamic prompt
    // let messages = [
    //     {
    //         "role": "system",
    //         "content": "Your job is to set up questions for the given topic. Give a wide range of easy and hard questions that can be anything about the topic. You must follow the format no matter the topic, and only give one question at a time and it is really important that you do not repeate the same question, make sure you are not asking the same question with a small difference, and must only be 6 lines. Have a variety of question types, like 'what does' and 'when was' and 'why does'. \n" +
    //             "Some examples of good questions are, 'Who wrote the novel 1984?', 'In what year was the first iPhone released?', 'Who painted the Mona Lisa?', 'Which planet is known as the Red Planet?', 'Who discovered electricity?', 'Who came up with the theory of relativity?', 'Who directed the movie Jurassic Park?', 'How many players are there in a soccer team?'. For example the format of the question should look like this:\n" +
    //             "When was Canada founded?\n" +
    //             "1) 1848\n" +
    //             "2) 1890\n" +
    //             "3) 1920\n" +
    //             "4) 1867\n" +
    //             "Correct answer: 4\n\n" +
    //             "or the question can look like this:\n" +
    //             "What is the binary system based on?\n" +
    //             "1) 2\n" +
    //             "2) 4\n" +
    //             "3) 18\n" +
    //             "4) 32\n" +
    //             "Correct answer: 1\n\n" +
    //             "or the question can look like this:\n" +
    //             "Why do cells divide?\n" +
    //             "1) To die easier\n" +
    //             "2) For body tissue to continuously renew itself\n" +
    //             "3) To grow hair\n" +
    //             "4) So you can sweat\n" +
    //             "Correct answer: 2\n"
    //     },
    //     {
    //         "role": "user",
    //         "content": `The topic of the questions is ${inputTopic}`
    //     }
    // ];
    //setting up the ai model and prepare it to create questions 
    let messages = [
        {
            "role": "system",
            "content": `I need you to give a wide range of easy and hard questions about ${inputTopic}. You must follow the format no matter the topic, and only give one question at a time and it is really important that you do not repeat the same question, make sure you are not asking the same question with a small difference, and must only be 6 lines. 
                  Some examples of good questions are, 'Who wrote the novel 1984?', 'In what year was the first iPhone released?', 'Who painted the Mona Lisa?', 'Which planet is known as the Red Planet?', 'Who discovered electricity?', 'Who came up with the theory of relativity?', 'Who directed the movie Jurassic Park?', 'How many players are there in a soccer team?'. For example the format of the question should look like this:
                  When was Canada founded?
                  1) 1848
                  2) 1890
                  3) 1920
                  4) 1867
                  Correct answer: 4

                  or the question can look like this:
                  What is the binary system based on?
                  1) 2
                  2) 4
                  3) 18
                  4) 32
                  Correct answer: 1

                  or the question can look like this:
                  Why do cells divide?
                  1) To die easier
                  2) For body tissue to continuously renew itself
                  3) To grow hair
                  4) So you can sweat
                  Correct answer: 2`
        },
        {
            "role": "user",
            "content": `The topic of the questions is ${inputTopic}` 
        }
    ];

    const quiz = await main(messages);
    console.log(quiz);
    answer = quiz[5][16]; // Assuming correct answer position
    displayQuiz(quiz);
}

async function main(messages) {
    try {
        //make sure the address is the same as the node https-server --cors address in the terminal 
        const response = await fetch('http://192.168.2.11:8081/generate-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: messages })
        });

        const data = await response.json();
        return data.quiz;
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayQuiz(quiz) {
    let questionElement = document.getElementById('question-element');
    questionElement.textContent = quiz[0]; // Assuming quiz[0] is the question text

    // Assuming quiz[1] to quiz[4] are the answer options
    for (let i = 1; i <= 4; i++) {
        let element = document.getElementById('answer' + i + '-btn');
        element.textContent = quiz[i];
    }
}

function playRight(){
    var audioCorrect = new Audio('correct-choice-43861.mp3')
    audioCorrect.play();
}
function playWrong(){
    var audioWrong = new Audio('wronganswer2-output.mp3')
    audioWrong.play();
}

function checkAnswer(event) {
    if (event.target.id[6] == answer) {
        let button = document.getElementById(event.target.id);
        button.style.color = 'green';
        playRight();
    } else {
        let button = document.getElementById(event.target.id);
        button.style.color = 'red';
        playWrong();
    }
}
