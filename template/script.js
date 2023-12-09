// 画像と関連するフォント名を配列で定義
const imagesAndFonts = [
    { src: 'photos/マティス-M.jpg', font: 'マティス-M' },
    { src: 'photos/パルラムネ.jpg', font: 'パルラムネ' }
    // 必要に応じて他の画像とフォントを追加
];

let currentImageIndex = 1;
let results = [];
let tempresult = {};

function checkInput() {
    var participantNumber = document.getElementById('participantNumber').value;
    if (participantNumber.length >= 3) {
        // 番号が入力されている場合、ボタンを有効化
        document.getElementById('startButton').disabled = false;
    } else {
        // 番号が入力されていない場合、ボタンを無効化
        document.getElementById('startButton').disabled = true;
    }
}

function startExperiment() {
    // 参加者情報を取得
    const participantNumber = document.getElementById('participantNumber').value;
    const gender = document.getElementById('gender').value;
    console.log("参加者番号: " + participantNumber + ", 性別: " + gender);

    // 参加者情報入力フォームを隠す
    document.getElementById('initialForm').style.display = 'none';

    // 最初のテキストを表示
    showExperimentDescription();
}

function showExperimentDescription() {
    document.getElementById('experimentDescription').style.display = 'block';
}

function startTextDisplay() {
    // 実験説明画面を隠す
    document.getElementById('experimentDescription').style.display = 'none';

    // 1秒の遅延後にテキスト（または画像）表示画面を表示
    setTimeout(function() {
        document.getElementById('textDisplay').style.display = 'block';

        // 0.2秒表示した後、1秒遅延して評価画面を表示
        setTimeout(function() {
            document.getElementById('textDisplay').style.display = 'none';
            setTimeout(function() {
                document.getElementById('formalityRating').style.display = 'block';
            }, 1000); // 1秒の遅延
        }, 200); // 0.2秒の表示
    }, 1000); // 1秒の遅延
}

function showNextImage() {
    if (currentImageIndex < imagesAndFonts.length) {
        const imageData = imagesAndFonts[currentImageIndex];
        const imageElement = document.getElementById('textDisplay').getElementsByTagName('img')[0];

        // 画像表示を非表示にし、評価をリセット
        document.getElementById('textDisplay').style.display = 'none';
        document.getElementById('formalityRating').style.display = 'none';
        document.getElementById('impactRating').style.display = 'none';
        document.getElementById('formality').value = ''; // フォーマル度の評価の値をリセット
        document.getElementById('impact').value = ''; // インパクトの評価の値をリセット

        // 1秒遅延後に画像を表示
        setTimeout(function() {
            imageElement.src = imageData.src;
            document.getElementById('textDisplay').style.display = 'block';

            // 0.2秒表示した後、1秒遅延してフォーマル度の評価画面を表示
            setTimeout(function() {
                document.getElementById('textDisplay').style.display = 'none';
                setTimeout(function() {
                    document.getElementById('formalityRating').style.display = 'block';
                }, 1000); // 1秒の遅延
            }, 200); // 0.2秒の表示
        }, 1000); // 1秒の遅延

        currentImageIndex++;
    } else {
        finishExperiment();
    }
}

function submitFormalityRating() {
    // フォーマル度の評価を取得し、一時的な結果に保存
    const formalityRating = document.getElementById('formality').value;
    tempresult.formality = formalityRating;

    // フォーマル度の評価が入力されていない場合、警告を表示
    if (!formalityRating) {
        alert("フォーマル度の評価を入力してください。");
        return;
    }

    // フォーマル度の評価画面を隠し、インパクトの評価画面を表示
    document.getElementById('formalityRating').style.display = 'none';
    document.getElementById('impactRating').style.display = 'block';
}

function submitImpactRating() {
    // インパクトの評価を取得し、一時的な結果に追加
    const impactRating = document.getElementById('impact').value;

    // インパクトの評価が入力されていない場合、警告を表示
    if (!impactRating) {
        alert("インパクトの評価を入力してください。");
        return;
    }

    tempresult.impact = impactRating;

    // 現在の画像に関連するフォント名を追加
    const imageData = imagesAndFonts[currentImageIndex - 1];
    tempresult.font = imageData.font;

    // 一時的な結果をresults配列に追加
    results.push(tempresult);

    // 次の画像を表示する前に一時的な結果をリセット
    tempresult = {};

    // インパクトの評価画面を隠し、次の画像を表示する関数を呼び出す
    document.getElementById('impactRating').style.display = 'none';
    showNextImage();
}

function finishExperiment() {
    // 実験関連要素を非表示にする
    document.getElementById('formalityRating').style.display = 'none';

    // 実験終了画面を表示する
    document.getElementById('experimentEnd').style.display = 'block';
}

function downloadResults() {
    const participantNumber = document.getElementById('participantNumber').value;
    const gender = document.getElementById('gender').value;

    // ファイルに保存するテキストを生成
    let textToSave = "Number: " + participantNumber + ", Gender: " + gender + "\n";
    textToSave += results.map(result => 
        `FontStyle: ${result.font}, Formality: ${result.formality}, Impact: ${result.impact}`
    ).join('\n');

    // テキストファイルを作成してダウンロード
    const blob = new Blob([textToSave], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "experiment_results.txt";
    link.href = window.URL.createObjectURL(blob);
    link.onclick = () => {
        setTimeout(() => {
            window.URL.revokeObjectURL(link.href);
        }, 1500);
    };
    link.click();
}
