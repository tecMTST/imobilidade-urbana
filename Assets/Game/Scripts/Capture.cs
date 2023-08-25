using UnityEngine;
using UnityEngine.SceneManagement;

public class GameOverBothObjectsCheck : MonoBehaviour
{
    public string gameOverSceneName = "GameOverScene"; 
    public Transform objectToCheck1;
    public Transform objectToCheck2;
    public float detectionRadius1 = 2.0f;
    public float detectionRadius2 = 2.0f;

    private void Update()
    {
        Vector2 squareObjectPosition = transform.position;
        Vector2 object1Position = objectToCheck1.position;
        Vector2 object2Position = objectToCheck2.position;

        bool isObject1InArea = Vector2.Distance(squareObjectPosition, object1Position) < detectionRadius1;
        bool isObject2InArea = Vector2.Distance(squareObjectPosition, object2Position) < detectionRadius2;

        if (isObject1InArea && isObject2InArea)
        {
            SceneManager.LoadScene(gameOverSceneName);
        }
    }
}
