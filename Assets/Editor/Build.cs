using UnityEditor;

class Build
{
    static void BuildWebGL()
    {
        BuildPlayerOptions opts = new BuildPlayerOptions();
        opts.scenes = new[] {
            // TODO: Descomentar assim que a intro conectar-se ao TrainScene
            // "Assets/Game/Scenes/IntroductionScene.unity",
            "Assets/Game/Scenes/TrainScene.unity",
            "Assets/Game/Scenes/GameOverScene.unity"
        };
        opts.locationPathName = "docs/";
        opts.target = BuildTarget.WebGL;

        BuildPipeline.BuildPlayer(opts);
    }
}

