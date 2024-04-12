/*--Запись_состояния_элементов_разметки_в_переменные--------------------------------------*/
let playing_field = document.getElementById("playing_field");
const btn_start_game = document.getElementById("btn_start_game");
const btn_stop_game = document.getElementById("btn_stop_game");
const play_area = document.getElementById("play_area");
const game_end_area = document.getElementById("game_end_area");
const users_result = document.getElementById("users_result");
const lbl_game_over = document.getElementById("lbl_game_over");

/*--Объявление_основных_переменных--------------------------------------------------------*/

//-хранение_координат_игрового_поля
let matrix; 
let old_x = 0, old_y = 0;
let new_x, new_y;
let matrix_column = 4, matrix_row = 4;

//-хранение_изменения_местоположения_блоков
let is_swiped, swiped_direction;

//-хранение_количества_набранных_пользователем_очков
let users_score;

/*--Запуск_игры--------------------------------------------------------------------------*/
const start_game = () => {
    users_score = 0;
    document.getElementById("users_score").innerText = users_score;
    
    playing_field.innerHTML = "";
    matrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    
    play_area.classList.remove("unvisible");
    game_end_area.classList.add("unvisible");
    document.getElementById("title_game").style.display = "none";
    create_playing_field();
    generate_two_block();
    generate_two_block();

    btn_stop_game.addEventListener("click", () => {
        game_end_area.classList.remove("unvisible");
        play_area.classList.add("unvisible");
        lbl_game_over.classList.remove("unvisible");

        users_result.innerText = `Your score: ${users_score}`;
        btn_start_game.innerText = "Restart Game";
    });
};

btn_start_game.addEventListener("click", () => {
    start_game();
    swiped_direction = "";
});

/*--Координаты_смещения_игрового_поля-----------------------------------------------------*/
let margin_left = playing_field.getBoundingClientRect().left;
let margin_top = playing_field.getBoundingClientRect().top;

/*--Получение_новых_значений_координат_перемещенного_блока--------------------------------*/
const get_xy = (e) => {
    new_x = e.touches[0].pageX - margin_left;
    new_y = e.touches[0].pageY - margin_top;
};

/*--Заполнение_игрового_поля_блоками------------------------------------------------------*/
const create_playing_field = () => {
    for (let i = 0; i < matrix_row; i++) {
      for (let j = 0; j < matrix_column; j++) {
        const div_block = document.createElement("div");
        div_block.classList.add("block");
        div_block.setAttribute("data-position", `${i}_${j}`);
        playing_field.appendChild(div_block);
      }
    }
  };

/*--Проверяем_равен_соседний_блок_исходному_или_нет---------------------------------------*/
const check_neighboring_block = (array_blocks) => {
    for (let i = 0; i < array_blocks.length - 1; i++) {
        if (array_blocks[i] == array_blocks[i + 1]) return true;
    }
    
    return false;
};

/*--Получение_возможных_ходов-------------------------------------------------------------*/
const check_possible_moves = () => {
    for (let i in matrix) {
        if (check_neighboring_block(matrix[i])) return true;

        let add_blocks = [];
        for (let j = 0; j < matrix_column; j++) add_blocks.push(matrix[i][j]);
        if (check_neighboring_block(add_blocks)) return true;
    }
    
    return false;
};

/*--Проверяем_ячейка_поля_свободна_или_нет------------------------------------------------*/
const check_empty_block = () => {
    for (let first_index in matrix) {
        for (let second_index in matrix[first_index]) {
            if (matrix[first_index][second_index] == 0) return true;
        }
    }
    
    return false;
};

/*--Перемещение_блоков_вниз---------------------------------------------------------------*/
const swipe_block_down = () => {
    for (let i = 0; i < matrix_column; i++) {
        let number = [];

        for (let j = 0; j < matrix_row; j++) number.push(matrix[j][i]);
        number = check_score(number, true);
        
        for (let j = 0; j < matrix_row; j++) {
            matrix[j][i] = number[j];

            let new_block = document.querySelector(`[data-position='${j}_${i}']`);
            new_block.innerHTML = matrix[j][i] ? matrix[j][i] : "";
            new_block.classList.value = "";
            new_block.classList.add("block", `block_${matrix[j][i]}`);
        }
    }
    
    let continuation = Math.random() > 0.5 ? 1 : 0;
    if (continuation) setTimeout(generate_four_block, 200);
    else setTimeout(generate_two_block, 200);
};

/*--Перемещение_блоков_вверх--------------------------------------------------------------*/
const swipe_block_up = () => {
    for (let i = 0; i < matrix_column; i++) {
        let number = [];
        
        for (let j = 0; j < matrix_row; j++) number.push(matrix[j][i]);
        number = check_score(number);
        
        for (let j = 0; j < matrix_row; j++) {
            matrix[j][i] = number[j];
            
            let new_block = document.querySelector(`[data-position = '${j}_${i}']`);
            new_block.innerHTML = matrix[j][i] ? matrix[j][i] : "";
            new_block.classList.value = "";
            new_block.classList.add("block", `block_${matrix[j][i]}`);
        }
    }
    
    let continuation = Math.random() > 0.5 ? 1 : 0;
    if (continuation) setTimeout(generate_four_block, 200);
    else setTimeout(generate_two_block, 200);
};

/*--Перемещение_блоков_вправо-------------------------------------------------------------*/
const swipe_block_right = () => {
    for (let i = 0; i < matrix_row; i++) {
        let number = [];

        for (let j = 0; j < matrix_column; j++) number.push(matrix[i][j]);
        number = check_score(number, true);
        
        for (let j = 0; j < matrix_column; j++) {
            matrix[i][j] = number[j];
            
            let new_block = document.querySelector(`[data-position = '${i}_${j}']`);
            new_block.innerHTML = matrix[i][j] ? matrix[i][j] : "";
            new_block.classList.value = "";
            new_block.classList.add("block", `block_${matrix[i][j]}`);
        }
    }
    
    let continuation = Math.random() > 0.5 ? 1 : 0;
    if (continuation) setTimeout(generate_four_block, 200);
    else setTimeout(generate_two_block, 200);
};

/*--Перемещение_блоков_влево--------------------------------------------------------------*/
const swipe_block_left = () => {
    for (let i = 0; i < matrix_row; i++) {
        let number = [];
        
        for (let j = 0; j < matrix_column; j++) number.push(matrix[i][j]);
        number = check_score(number);
        
        for (let j = 0; j < matrix_column; j++) {
            matrix[i][j] = number[j];
            
            let new_block = document.querySelector(`[data-position = '${i}_${j}']`);
            new_block.innerHTML = matrix[i][j] ? matrix[i][j] : "";
            new_block.classList.value = "";
            new_block.classList.add("block", `block_${matrix[i][j]}`);
        }
    }
    
    let continuation = Math.random() > 0.5 ? 1 : 0;
    if (continuation) setTimeout(generate_four_block, 200);
    else setTimeout(generate_two_block, 200);
};

/*--Выбор_направления_перемещения_блоков-------------------------------------------------*/
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") swipe_block_left();
    else if (e.code == "ArrowRight") swipe_block_right();
    else if (e.code == "ArrowUp") swipe_block_up();
    else if (e.code == "ArrowDown") swipe_block_down();
    
    document.getElementById("users_score").innerText = users_score;
});

/*--Обработка_событий_перемещения_блоков_по_игровому_полю---------------------------------*/
playing_field.addEventListener("touchstart", (event) => {
    is_swiped = true;
    get_xy(event);
    old_x = new_x;
    old_y = new_y;
});

playing_field.addEventListener("touchmove", (event) => {
     if (is_swiped) {
        get_xy(event);
        let diffX = new_x - old_x;
        let diffY = new_y - old_y;
        
        if (Math.abs(diffY) > Math.abs(diffX)) swiped_direction = diffX > 0 ? "down" : "up";
        else swiped_direction = diffX > 0 ? "right" : "left";
    }
});

playing_field.addEventListener("touchend", () => {
    is_swiped = false;
    
    let swipeCalls = {
        up: swipe_block_up,
        down: swipe_block_down,
        left: swipe_block_left,
        right: swipe_block_right,
    };

    swipeCalls[swiped_direction]();
    document.getElementById("users_score").innerText = users_score;
});

/*--Определение_рандомной_позиции_появления_новых_блоков_на_игровом_поле------------------*/
const add_new_position_random = (array_blocks) => {
    return Math.floor(Math.random() * array_blocks.length);
};

/*--Появление_новых_блоков_в_рандомной_ячейке_игрового_поля_после_успешного_хода_игрока---*/

const generate_two_block = () => {
    if (check_empty_block()) {
        let random_row = add_new_position_random(matrix);
        let random_column = add_new_position_random(matrix[add_new_position_random(matrix)]);
        
        if (matrix[random_row][random_column] == 0) {

            matrix[random_row][random_column] = 2;

            let new_block = document.querySelector(`[data-position = '${random_row}_${random_column}']`);
            new_block.innerHTML = 2;
            new_block.classList.add("block_2");
        } 
        else generate_two_block();

    } 
    else check_game_over();
};

const generate_four_block = () => {
    if (check_empty_block()) {
        let random_row = add_new_position_random(matrix);
        let random_column = add_new_position_random(matrix[add_new_position_random(matrix)]);
        
        if (matrix[random_row][random_column] == 0) {
            
            matrix[random_row][random_column] = 4;
            
            let new_block = document.querySelector(`[data-position= '${random_row}_${random_column}']`);
            new_block.innerHTML = 4;
            new_block.classList.add("block_4");
        } 
        else generate_four_block();
    
    } 
    else check_game_over();
};

/*--Удаление_пустых_блоков----------------------------------------------------------------*/
const remove_zero_block = (array_blocks) => array_blocks.filter((number) => number);

/*--Подсчет_счета_игрока------------------------------------------------------------------*/
const check_score = (array_blocks, reverse_array_blocks = false) => {
    array_blocks = reverse_array_blocks ? remove_zero_block(array_blocks).reverse() : remove_zero_block(array_blocks);
    
    for (let i = 0; i < array_blocks.length - 1; i++) {
        if (array_blocks[i] == array_blocks[i + 1]) {
            array_blocks[i] += array_blocks[i + 1];
            array_blocks[i + 1] = 0;
            users_score += array_blocks[i];
        }
    }
    
    array_blocks = reverse_array_blocks ? remove_zero_block(array_blocks).reverse() : remove_zero_block(array_blocks);
    let count_free_places = 4 - array_blocks.length;
    
    while (count_free_places > 0) {
        if (reverse_array_blocks) array_blocks.unshift(0);
        else array_blocks.push(0);
        
        count_free_places -= 1;
    }
    
    return array_blocks;
};


/*--Проверяем_выполнены_условия_завершения_игры_или_нет-----------------------------------*/
const check_game_over = () => {
    if (!check_possible_moves()) {
        game_end_area.classList.remove("unvisible");
        play_area.classList.add("unvisible");
        lbl_game_over.classList.remove("unvisible");

        users_result.innerText = `Your score: ${users_score}`;
        btn_start_game.innerText = "Restart Game";
    }
};