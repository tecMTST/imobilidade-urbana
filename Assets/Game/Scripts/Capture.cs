using UnityEngine;
using UnityEngine.SceneManagement;

public class GameOverBothObjectsCheck : MonoBehaviour
{
    public string gameOverSceneName = "GameOverScene"; 
    public Transform objectToCheck1; // Transform of the first object to check
    public Transform objectToCheck2; // Transform of the second object to check
    // public float detectionRadius = 2.0f; // Radius of the detection area

    private void Update()
    {
        Vector2 squareObjectPosition = transform.position;
        Vector2 object1Position = objectToCheck1.position;
        Vector2 object2Position = objectToCheck2.position;

        // Check if both objects are within the detection radius
        bool isObject1InArea = Vector2.Distance(squareObjectPosition, object1Position) < 7f;
        bool isObject2InArea = Vector2.Distance(squareObjectPosition, object2Position) < 9.3f;

        // Print distances for debugging
        Debug.Log("Distance to Object 1: " + Vector2.Distance(squareObjectPosition, object1Position));
        Debug.Log("Distance to Object 2: " + Vector2.Distance(squareObjectPosition, object2Position));

        if (isObject1InArea && isObject2InArea)
        {
            SceneManager.LoadScene(gameOverSceneName);
        }
    }
}
