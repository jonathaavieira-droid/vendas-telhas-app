-- INSTRUCTIONS: Run this in Supabase SQL Editor to populate your database

-- 1. Insert Example Products (Includes CAVABEN data)
-- Note: User renamed column "desc" to "descr" in database
INSERT INTO products (name, category, descr, img, cavaben) VALUES
(
    'Telha Termoacústica (Sanduíche)', 
    'Cobertura', 
    'Telha com núcleo isolante de PIR/EPS, acabamento em aço galvalume. Espessura de 30mm a 100mm.',
    'https://images.unsplash.com/photo-1628624747186-a9419477443f?w=800',
    'CARACTERÍSTICA: Núcleo de isopor (EPS) ou poliuretano (PIR) entre duas chapas de aço.\nVANTAGEM: Bloqueia até 95% do calor externo e reduz o ruído de chuva em 30dB.\nBENEFÍCIO: Você economiza até 40% na conta de luz com ar-condicionado e ganha um ambiente de trabalho silencioso e produtivo.'
),
(
    'Telha Trapezoidal TP40', 
    'Cobertura', 
    'Perfil, aço galvalume AZ150, resistência para grandes vãos e chuva forte.',
    'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800',
    'CARACTERÍSTICA: Formato trapezoidal com nervuras altas de 40mm.\nVANTAGEM: Alta capacidade de escoamento de água e resistência a ventos fortes.\nBENEFÍCIO: Sua obra fica protegida contra goteiras e destelhamentos, garantindo zero dor de cabeça em tempestades.'
),
(
    'Cumeeira Shed Dentada', 
    'Acabamento', 
    'Peça de acabamento para fechamento do topo do telhado, com recortes para encaixe perfeito.',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    'CARACTERÍSTICA: Recorte preciso no formato da onda da telha.\nVANTAGEM: Vedação total contra entrada de pássaros, insetos e poeira.\nBENEFÍCIO: Um galpão limpo e livre de pragas, preservando seu estoque e equipamentos.'
),
(
    'Parafuso Auto-Brocante', 
    'Fixação', 
    'Parafuso com ponta de broca e arruela de vedação EPDM.',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    'CARACTERÍSTICA: Ponta reforçada que fura, rosca e fixa em uma única operação.\nVANTAGEM: Instalação 3x mais rápida que o método convencional.\nBENEFÍCIO: Você entrega a obra antes do prazo e economiza em horas de mão-de-obra.'
);

-- 2. Insert Example Objections
INSERT INTO objections (category, q, a) VALUES
(
    'Custo',
    'A telha sanduíche é muito cara, prefiro a comum.',
    'SENTIR: Eu entendo que o preço inicial assusta um pouco. SENTIU: O dono da Transportadora Silva pensava assim também. DESCOBRIU: Ele colocou na ponta do lápis: sem precisar fazer forro e economizando 30% de energia todo mês, a telha se pagou em 1 ano e meio. É um investimento, não um gasto.'
),
(
    'Durabilidade',
    'Tenho medo de ferrugem, moro perto da praia.',
    'SENTIR: É uma preocupação super válida para nossa região. SENTIU: Muitos clientes já tiveram prejuízo com telhas galvanizadas comuns. DESCOBRIU: Nossa telha usa aço Galvalume AZ150, que tem alumínio na composição. Ela dura 4x mais que a comum em maresia. Dou garantia de fábrica de 10 anos contra corrosão.'
),
(
    'Prazo',
    'Preciso pra ontem, não posso esperar 15 dias.',
    'SENTIR: Sei que sua obra não pode parar. SENTIU: A Construtora Ramos também tinha um cronograma apertado. DESCOBRIU: Temos um estoque regulador de medidas padrão (6m e 7m) para entrega em 48h. Se sua medida for padrão, resolvemos isso agora.'
),
(
    'Conforto',
    'Barulho de chuva em telha metálica é insuportável.',
    'SENTIR: Ninguém consegue trabalhar com barulho de chuva, concordo. SENTIU: Em galpões antigos de zinco era impossível mesmo. DESCOBRIU: Com o isolamento termoacústico, o som é amortecido. É o mesmo nível de ruído de uma telha de barro ou laje. Convido você a visitar nosso showroom num dia de chuva!'
);
